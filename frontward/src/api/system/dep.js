import request from '@/utils/request'

// 查询岗位列表
export function listDep(query) {
  return request({
    url: '/system/dep/list',
    method: 'get',
    params: query
  })
}

// 查询岗位详细
export function getDep(depId) {
  return request({
    url: '/system/dep/' + depId,
    method: 'get'
  })
}

// 新增岗位
export function addDep(data) {
  return request({
    url: '/system/dep',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updateDep(data) {
  return request({
    url: '/system/dep',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function delDep(depId) {
  return request({
    url: '/system/dep/' + depId,
    method: 'delete'
  })
}
