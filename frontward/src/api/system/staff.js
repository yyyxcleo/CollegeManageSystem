import request from '@/utils/request'

// 查询岗位列表
export function listStaff(query) {
  return request({
    url: '/system/staff/list',
    method: 'get',
    params: query
  })
}

// 查询岗位详细
export function getStaff(stuId) {
  return request({
    url: '/system/staff/' + stuId,
    method: 'get'
  })
}

// 新增岗位
export function addStaff(data) {
  return request({
    url: '/system/staff',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updateStaff(data) {
  return request({
    url: '/system/staff',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function delStaff(staffId) {
  return request({
    url: '/system/staff/' + staffId,
    method: 'delete'
  })
}
