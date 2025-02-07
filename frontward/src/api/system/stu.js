import request from '@/utils/request'

// 查询岗位列表
export function listStu(query) {
  return request({
    url: '/system/stu/list',
    method: 'get',
    params: query
  })
}

// 查询岗位详细
export function getStu(stuId) {
  return request({
    url: '/system/stu/' + stuId,
    method: 'get'
  })
}

// 新增岗位
export function addStu(data) {
  return request({
    url: '/system/stu',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updateStu(data) {
  return request({
    url: '/system/stu',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function delStu(stuId) {
  return request({
    url: '/system/stu/' + stuId,
    method: 'delete'
  })
}
