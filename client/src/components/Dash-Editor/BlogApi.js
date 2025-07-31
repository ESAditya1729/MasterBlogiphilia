import axios from 'axios';
import DOMPurify from 'dompurify';

// Configure API base URL with fallback
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
if (!API_BASE_URL) {
  console.error('API base URL not configured!');
}

// Request timeout configuration (in milliseconds)
const REQUEST_TIMEOUT = 15000;
const LONG_REQUEST_TIMEOUT = 30000; // For content-heavy requests

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => {
    // You can modify successful responses here
    return response;
  },
  (error) => {
    // Handle errors globally
    return Promise.reject(handleApiError(error));
  }
);

/**
 * Validates and sanitizes blog data before API submission
 * @param {Object} data - Raw blog data
 * @returns {Object} - Sanitized and validated data
 */
const sanitizeBlogData = (data) => {
  // Required fields configuration with validation rules
  const fieldConfig = {
    title: {
      min: 5,
      max: 120,
      sanitize: true,
      required: true
    },
    excerpt: {
      min: 50,
      max: 200,
      sanitize: true,
      required: true
    },
    genre: {
      min: 3,
      max: 30,
      sanitize: true,
      required: true
    },
    content: {
      minWords: 100,
      sanitize: true,
      required: true
    },
    author: {
      required: true
    },
    tags: {
      maxItems: 5,
      transform: (tags) => Array.isArray(tags) 
        ? tags.filter(tag => tag.trim().length > 0)
        : tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    },
    seoKeywords: {
      transform: (keywords) => Array.isArray(keywords)
        ? keywords.filter(kw => kw.trim().length > 0)
        : keywords.split(',').map(kw => kw.trim()).filter(kw => kw)
    }
  };

  const errors = {};
  const result = {};

  // Process each field
  Object.entries(fieldConfig).forEach(([field, config]) => {
    const value = data[field];
    
    // Check required fields
    if (config.required && !value) {
      errors[field] = `${field} is required`;
      return;
    }

    // Skip validation if field is empty and not required
    if (!value && !config.required) {
      return;
    }

    // Transform arrays (like tags)
    if (config.transform) {
      try {
        result[field] = config.transform(value);
      } catch (err) {
        errors[field] = `Invalid format for ${field}`;
      }
      return;
    }

    // String validation
    if (typeof value === 'string') {
      let processedValue = value.trim();
      
      // Sanitize HTML content
      if (config.sanitize) {
        processedValue = DOMPurify.sanitize(processedValue);
      }

      // Length validation
      if (config.min && processedValue.length < config.min) {
        errors[field] = `${field} must be at least ${config.min} characters`;
      }
      if (config.max && processedValue.length > config.max) {
        errors[field] = `${field} must be less than ${config.max} characters`;
      }

      // Word count validation for content
      if (field === 'content' && config.minWords) {
        const textOnly = processedValue.replace(/<[^>]+>/g, ' ');
        const wordCount = textOnly.split(/\s+/).filter(Boolean).length;
        if (wordCount < config.minWords) {
          errors.content = `Content must be at least ${config.minWords} words`;
        }
      }

      result[field] = processedValue;
    } else {
      result[field] = value;
    }
  });

  if (Object.keys(errors).length > 0) {
    throw {
      name: 'ValidationError',
      message: 'Blog data validation failed',
      errors
    };
  }

  return result;
};

/**
 * Unified error handler for API requests
 * @param {Error} error - The error object
 * @returns {Object} - Standardized error object
 */
const handleApiError = (error) => {
  console.error('API Error:', error);

  // Axios errors
  if (axios.isCancel(error)) {
    return {
      name: 'RequestCancelled',
      message: 'Request was cancelled'
    };
  }

  // Network errors (no response)
  if (error.isAxiosError && !error.response) {
    return {
      name: 'NetworkError',
      message: 'Network connection failed. Please check your internet connection.',
      isNetworkError: true
    };
  }

  // Server response errors
  if (error.response) {
    const { status, data } = error.response;
    
    // Validation errors from server
    if (status === 400 && data?.errors) {
      return {
        name: 'ValidationError',
        message: data.message || 'Validation failed',
        errors: data.errors,
        status
      };
    }

    // Authentication errors
    if (status === 401 || status === 403) {
      return {
        name: 'AuthError',
        message: data.message || 'Authentication required',
        status
      };
    }

    // Not found errors
    if (status === 404) {
      return {
        name: 'NotFoundError',
        message: data.message || 'Resource not found',
        status
      };
    }

    // Server errors
    if (status >= 500) {
      return {
        name: 'ServerError',
        message: data.message || `Server error (${status})`,
        status
      };
    }

    // Generic client errors
    return {
      name: 'ClientError',
      message: data.message || `Error (${status})`,
      status
    };
  }

  // Our custom validation errors
  if (error.name === 'ValidationError') {
    return error;
  }

  // Other errors (timeouts, etc.)
  return {
    name: 'RequestError',
    message: error.message || 'Request failed. Please try again.'
  };
};

/**
 * Saves blog to backend (draft or published)
 * @param {Object} blogData - Complete blog data
 * @param {string|null} blogId - ID for existing blog (null for new)
 * @param {string} token - Auth token
 * @param {boolean} publish - Whether to publish
 * @returns {Promise<Object>} - Saved blog data
 * @throws {Error} - Validation or API error
 */
export const saveBlogApi = async (blogData, blogId, publish = false) => {
  // Validate and sanitize data
  const sanitizedData = sanitizeBlogData({
    ...blogData,
    status: publish ? 'published' : blogData.status || 'draft'
  });

  const config = {
    timeout: sanitizedData.content?.length > 10000 ? LONG_REQUEST_TIMEOUT : REQUEST_TIMEOUT
  };

  const endpoint = blogId 
    ? `/api/blogs/${blogId}`
    : '/api/blogs';

  const method = blogId ? 'put' : 'post';

  try {
    const response = await apiClient[method](endpoint, sanitizedData, config);
    
    // Validate response structure
    if (!response.data?._id || !response.data?.title || !response.data?.status) {
      throw {
        name: 'InvalidResponse',
        message: 'Invalid response structure from server'
      };
    }

    return response.data;
  } catch (error) {
    throw error; // Error is already processed by interceptor
  }
};

/**
 * Loads blog data from backend
 * @param {string} blogId - Blog ID to load
 * @returns {Promise<Object>} - Blog data
 * @throws {Error} - API error
 */
export const loadBlogApi = async (blogId) => {
  if (!blogId) {
    throw {
      name: 'ValidationError',
      message: 'Blog ID is required'
    };
  }

  try {
    const response = await apiClient.get(`/api/blogs/${blogId}`);

    // Validate response structure
    if (!response.data?._id || !response.data?.title) {
      throw {
        name: 'InvalidResponse',
        message: 'Invalid blog data received from server'
      };
    }

    return response.data;
  } catch (error) {
    throw error; // Error is already processed by interceptor
  }
};

/**
 * Gets trending blogs
 * @returns {Promise<Array>} - Array of trending blogs
 */
export const getTrendingBlogs = async () => {
  try {
    const response = await apiClient.get('/api/blogs/trending');
    
    // Handle different response formats
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    throw {
      name: 'InvalidResponse',
      message: 'Invalid response format for trending blogs'
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Formats API errors for user display
 * @param {Error} error - Error object
 * @returns {string} - User-friendly error message
 */
export const formatApiError = (error) => {
  if (!error) return 'An unexpected error occurred';
  
  // Handle validation errors (both client and server-side)
  if (error.errors) {
    const errorMessages = Object.values(error.errors);
    return errorMessages.join('\n');
  }

  // Specific error messages
  switch (error.name) {
    case 'NetworkError':
      return 'Network connection failed. Please check your internet connection.';
    case 'AuthError':
      return 'Authentication failed. Please log in again.';
    case 'NotFoundError':
      return 'The requested blog was not found.';
    case 'RequestCancelled':
      return 'Request was cancelled';
    default:
      return error.message || 'An unexpected error occurred';
  }
};

// Export the axios instance for direct use if needed
export default apiClient;