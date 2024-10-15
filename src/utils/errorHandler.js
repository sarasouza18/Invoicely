const handleError = (res, error, message = 'Something went wrong', context = {}) => {
    console.error('Error context:', context);
    console.error(error);
    
    res.status(500).json({ error: message });
};

module.exports = { handleError };
