module.exports = function GetStatus(res, code, data = {}, massage, status) {
  return res.send({
    code: code,
    data: data,
    massage: massage,
    state: status,
  })
}