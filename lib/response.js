export function success(res, data = {}, message = "Success", status = 200) {
  return res.status(status).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
}

export function error(res, message = "Something went wrong", status = 500) {
  return res.status(status).json({
    success: false,
    message,
    timestamp: new Date().toISOString()
  });
}
