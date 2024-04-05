// Async handler  for handling asynchronous route handlers
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        // Wrapping the route handler in a Promise to handle asynchronous operations
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => {
                // Forwarding any errors to the error handling middleware
                next(err);
            });
    };
};

export default asyncHandler; 