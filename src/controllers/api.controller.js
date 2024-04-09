import fetch from 'node-fetch';
import asyncHandler from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

// Function to fetch data from the public API
const fetchDataFromAPI = async () => {
  const response = await fetch('https://api.publicapis.org/entries');
  return await response.json();
}

const getAllAPIs = asyncHandler(async (req, res) => {
  // Extract the limit parameter from the query string
  let { limit } = req.query;
  if(!limit){
    limit = 10
  }
  // Fetch data from the public API
  const data = await fetchDataFromAPI();

  // Check if data is received
  if (!data) {
    // If data is not received, throw an error
    throw new ApiError(500, "Failed to fetch the APIs. Please try again later.");
  }

  // Initialize filteredData with all APIs
  let filteredData = data.entries;

  // Apply result limit if provided
  
  filteredData = filteredData.slice(0, parseInt(limit));
  

  // Send response with filtered data
  return res.status(200).json(new ApiResponse(200, filteredData, "Successfully fetched all APIs."));
});


const getAPIsByCategory = asyncHandler(async (req, res) => {
  // Extract category and limit parameters
  const { category } = req.params;
  let { limit } = req.query;
  if(!limit){
      limit = 10
  }
  // Throw an error if category is not provided
  if (!category) {
    throw new ApiError(400, "Category parameter is required.");
  }

  // Fetch data from the public API
  const data = await fetchDataFromAPI();

  // Check if data is received
  if (!data) {
    // If data is not received, throw an error
    throw new ApiError(500, "Failed to fetch the APIs. Please try again later.");
  }

  // Filter data by category
  let filteredData = data.entries.filter(api => api.Category.toLowerCase() === category.toLowerCase());

  // Apply result limit if provided
  
  filteredData = filteredData.slice(0, parseInt(limit));
  
  // Send response with filtered data
  return res.status(200).json(new ApiResponse(200, filteredData, "Successfully fetched APIs by category."));
});

export {
  getAllAPIs,
  getAPIsByCategory
};