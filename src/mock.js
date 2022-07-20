const Mock = require('mockjs') //引入mockjs
const Random = Mock.Random //获取Random对象
let Result = {
    code: 200,
    msg: '操作成功！',
    data: null
}

//模拟生成验证码
Mock.mock('/captcha', 'get', () => {
    Result.data = {
        token: Random.string(32), //获取一个32位的字符串
        captchaImg: Random.dataImage('120x40', 'p7n5w')//生成基于base64编码的验证码为11111的图片
    }
    console.log('result', Result)
    return Result
})

//模拟用户登出
Mock.mock('/logout', 'post', () => {
    return Result
})

//模拟生成所有自行车信息
// id	int
// brand	varchar					自行车品牌
// describe	varchar			车辆描述
// image	varchar				自行车图片
// bike_status	int				自行车状态
// rent_status	int			租车状态
// created	datetime				添加时间
// updated	datetime			修改时间
Mock.mock('/bikes', 'get', () => {
    Result.data = {
        "bikes": [
            {
                "id": 1,
                "brand": "吉安特",
                "created": "2021-01-04T10:09:14",
                "updated": "2021-01-30T08:19:52",
                "image": "https://lqz-1.oss-cn-beijing.aliyuncs.com/bikes/0c0f0292a345cd78020398d428d38b5f.jpeg",
                "bike_status": 1,
                "rent_status": 1,
                "describe": "只有基本查看功能",
                "user_id": 1
            },
            {
                "id": 2,
                "brand": "吉安特",
                "created": "2021-01-04T10:09:14",
                "updated": "2021-01-30T08:19:52",
                "image": "https://lqz-1.oss-cn-beijing.aliyuncs.com/bikes/a773505ea31d8c1bd10f2de819ebb898.jpeg",
                "bike_status": 1,
                "rent_status": 1,
                "describe": "只有基本查看功能",
                "user_id": 1
            },
            {
                "id": 3,
                "brand": "吉安特",
                "created": "2021-01-04T10:09:14",
                "updated": "2021-01-30T08:19:52",
                "image": "https://lqz-1.oss-cn-beijing.aliyuncs.com/bikes/7a3bc29ccdd5e33579df92d7cf35f9c4.jpeg",
                "bike_status": 1,
                "rent_status": 1,
                "describe": "只有基本查看功能",
                "user_id": 1
            }
        ],
        "total": 3,
        "size": 3,
        "current": 1,
        "orders": [],
        "optimizeCountSql": true,
        "hitCount": false,
        "countId": null,
        "maxLimit": null,
        "searchCount": true,
        "pages": 1
    }
    return Result
})

//模拟生成单个自行车信息
Mock.mock(RegExp('/bike*'), 'get', () => {
    Result.data = {
        "id": 1,
        "brand": "吉安特",
        "created": "2021-01-04T10:09:14",
        "updated": "2021-01-30T08:19:52",
        "image": "https://lqz-1.oss-cn-beijing.aliyuncs.com/bikes/0c0f0292a345cd78020398d428d38b5f.jpeg",
        "bike_status": 1,
        "rent_status": 1,
        "describe": "只有基本查看功能",
        "user_id": 1
    }
    return Result
})

//模拟生成单个用户信息
Mock.mock(RegExp('/sys/userInfo/*'), 'get', () => {

    Result.data = {
        "id": 2,
        "username": "test",
        "avatar": "https://picsum.photos/100/100?grayscale",
        "phone": "15193836387",
    }
    return Result
})

//模拟生成验证码
Mock.mock('/getCode','get',()=>{
    Result.data={"code":1111}
    return Result
})

// 获取用户菜单以及权限接口
Mock.mock('/sys/menu/nav', 'get', () => {

    let menus = [
        {
            name: 'SysManga',
            title: '系统管理',
            icon: 'el-icon-s-operation',
            path: '',
            component: '',
            children: [
                {
                    name: 'BackNavUser',
                    title: '用户管理',
                    icon: 'el-icon-s-custom',
                    path: '/back/users',
                    component: 'back/sys/User',
                    children: []
                },
                {
                    name: 'BackNavRole',
                    title: '角色管理',
                    icon: 'el-icon-rank',
                    path: '/back/roles',
                    component: 'back/sys/Role',
                    children: []
                },
                {
                    name: 'BackNavMenu',
                    title: '菜单管理',
                    icon: 'el-icon-menu',
                    path: '/back/menus',
                    component: 'back/sys/Menu',
                    children: []
                }
            ]
        },
        {
            name: 'SysTools',
            title: '系统工具',
            icon: 'el-icon-s-tools',
            path: '',
            component: '',
            children: [
                {
                    name: 'BackNavDict',
                    title: '数字字典',
                    icon: 'el-icon-s-order',
                    path: '/back/dicts',
                    component: 'back/sys/Dict',
                    children: []
                },
            ]
        }
    ]

    let authoritys = ['sys:user:list','sys:user:save','sys:user:delete']

    Result.data = {
        menus,
        authoritys
    }

    return Result
})

//***********************菜单管理**************************//
//模拟获取菜单管理列表数据
Mock.mock('/sys/menu/list', 'get', () => {
    let menus = [
        {
            "id": 1,
            "created": "2021-01-15T18:58:18",
            "updated": "2021-01-15T18:58:20",
            "status": 1,
            "parentId": 0,
            "name": "系统管理",
            "path": "",
            "perms": "sys:manage",
            "component": "",
            "type": 0,
            "icon": "el-icon-s-operation",
            "ordernum": 1,
            "children": [
                {
                    "id": 2,
                    "created": "2021-01-15T19:03:45",
                    "updated": "2021-01-15T19:03:48",
                    "status": 1,
                    "parentId": 1,
                    "name": "用户管理",
                    "path": "/sys/users",
                    "perms": "sys:user:list",
                    "component": "sys/User",
                    "type": 1,
                    "icon": "el-icon-s-custom",
                    "ordernum": 1,
                    "children": [
                        {
                            "id": 9,
                            "created": "2021-01-17T21:48:32",
                            "updated": null,
                            "status": 1,
                            "parentId": 2,
                            "name": "添加用户",
                            "path": null,
                            "perms": "sys:user:save",
                            "component": null,
                            "type": 2,
                            "icon": null,
                            "ordernum": 1,
                            "children": []
                        },
                        {
                            "id": 10,
                            "created": "2021-01-17T21:49:03",
                            "updated": "2021-01-17T21:53:04",
                            "status": 1,
                            "parentId": 2,
                            "name": "修改用户",
                            "path": null,
                            "perms": "sys:user:update",
                            "component": null,
                            "type": 2,
                            "icon": null,
                            "ordernum": 2,
                            "children": []
                        },
                        {
                            "id": 11,
                            "created": "2021-01-17T21:49:21",
                            "updated": null,
                            "status": 1,
                            "parentId": 2,
                            "name": "删除用户",
                            "path": null,
                            "perms": "sys:user:delete",
                            "component": null,
                            "type": 2,
                            "icon": null,
                            "ordernum": 3,
                            "children": []
                        },
                        {
                            "id": 12,
                            "created": "2021-01-17T21:49:58",
                            "updated": null,
                            "status": 1,
                            "parentId": 2,
                            "name": "分配角色",
                            "path": null,
                            "perms": "sys:user:role",
                            "component": null,
                            "type": 2,
                            "icon": null,
                            "ordernum": 4,
                            "children": []
                        },
                        {
                            "id": 13,
                            "created": "2021-01-17T21:50:36",
                            "updated": null,
                            "status": 1,
                            "parentId": 2,
                            "name": "重置密码",
                            "path": null,
                            "perms": "sys:user:repass",
                            "component": null,
                            "type": 2,
                            "icon": null,
                            "ordernum": 5,
                            "children": []
                        }
                    ]
                },
                {
                    "id": 3,
                    "created": "2021-01-15T19:03:45",
                    "updated": "2021-01-15T19:03:48",
                    "status": 1,
                    "parentId": 1,
                    "name": "角色管理",
                    "path": "/sys/roles",
                    "perms": "sys:role:list",
                    "component": "sys/Role",
                    "type": 1,
                    "icon": "el-icon-rank",
                    "ordernum": 2,
                    "children": []
                },

            ]
        },
        {
            "id": 5,
            "created": "2021-01-15T19:06:11",
            "updated": null,
            "status": 1,
            "parentId": 0,
            "name": "系统工具",
            "path": "",
            "perms": "sys:tools",
            "component": null,
            "type": 0,
            "icon": "el-icon-s-tools",
            "ordernum": 2,
            "children": [
                {
                    "id": 6,
                    "created": "2021-01-15T19:07:18",
                    "updated": "2021-01-18T16:32:13",
                    "status": 1,
                    "parentId": 5,
                    "name": "数字字典",
                    "path": "/sys/dicts",
                    "perms": "sys:dict:list",
                    "component": "sys/Dict",
                    "type": 1,
                    "icon": "el-icon-s-order",
                    "ordernum": 1,
                    "children": []
                }
            ]
        }
    ]

    Result.data = menus

    return Result
})
//根据id获取菜单数据
Mock.mock(RegExp('/sys/menu/info/*'), 'get', () => {

    Result.data = {
        "id": 3,
        "status": 1,
        "parentId": 1,
        "name": "角色管理",
        "path": "/sys/roles",
        "perms": "sys:role:list",
        "component": "sys/Role",
        "type": 1,
        "icon": "el-icon-rank",
        "orderNum": 2,
        "children": []
    }

    return Result
})

Mock.mock(RegExp('/sys/menu/delete/*'), 'post', () => {

    return Result
})

//////////////// 角色管理 ////////////////

Mock.mock(RegExp('/sys/role/list*'), 'get', () => {

    Result.data = {
        "records": [
            {
                "id": 3,
                "created": "2021-01-04T10:09:14",
                "updated": "2021-01-30T08:19:52",
                "status": 1,
                "name": "普通用户",
                "code": "normal",
                "remark": "只有基本查看功能",
                "menuIds": []
            },
            {
                "id": 6,
                "created": "2021-01-16T13:29:03",
                "updated": "2021-01-17T15:50:45",
                "status": 1,
                "name": "超级管理员",
                "code": "admin",
                "remark": "系统默认最高权限，不可以编辑和任意修改",
                "menuIds": []
            }
        ],
        "total": 2,
        "size": 10,
        "current": 1,
        "orders": [],
        "optimizeCountSql": true,
        "hitCount": false,
        "countId": null,
        "maxLimit": null,
        "searchCount": true,
        "pages": 1
    }

    return Result

})

Mock.mock(RegExp('/sys/role/info/*'), 'get', () => {

    Result.data = {
        "id": 6,
        "created": "2021-01-16T13:29:03",
        "updated": "2021-01-17T15:50:45",
        "status": 1,
        "name": "超级管理员",
        "code": "admin",
        "remark": "系统默认最高权限，不可以编辑和任意修改",
        "menuIds": [3]
    }

    return Result
})

Mock.mock(RegExp('/sys/role/*'), 'post', () => {

    return Result
})

//////////////// 用户管理 ////////////////

Mock.mock(RegExp('/sys/user/list*'), 'get', () => {
    Result.data = {
        "records": [
            {
                "id": 1,
                "created": "2021-01-12T22:13:53",
                "updated": "2021-01-16T16:57:32",
                "status": 1,
                "username": "admin",
                "password": "$2a$10$R7zegeWzOXPw871CmNuJ6upC0v8D373GuLuTw8jn6NET4BkPRZfgK",
                "avatar": "https://image-1300566513.cos.ap-guangzhou.myqcloud.com/upload/images/5a9f48118166308daba8b6da7e466aab.jpg",
                "email": "123@qq.com",
                "phone":"211234312",
                "city": "广州",
                "lastLogin": "2020-12-30T08:38:37",
                "roles": [
                    {
                        "id": 6,
                        "created": "2021-01-16T13:29:03",
                        "updated": "2021-01-17T15:50:45",
                        "status": 1,
                        "name": "超级管理员",
                        "code": "admin",
                        "remark": "系统默认最高权限，不可以编辑和任意修改",
                        "menuIds": []
                    },
                    {
                        "id": 3,
                        "created": "2021-01-04T10:09:14",
                        "updated": "2021-01-30T08:19:52",
                        "status": 1,
                        "name": "普通用户",
                        "code": "normal",
                        "remark": "只有基本查看功能",
                        "menuIds": []
                    }
                ]
            },
            {
                "id": 2,
                "created": "2021-01-30T08:20:22",
                "updated": "2021-01-30T08:55:57",
                "status": 1,
                "username": "test",
                "password": "$2a$10$0ilP4ZD1kLugYwLCs4pmb.ZT9cFqzOZTNaMiHxrBnVIQUGUwEvBIO",
                "avatar": "https://image-1300566513.cos.ap-guangzhou.myqcloud.com/upload/images/5a9f48118166308daba8b6da7e466aab.jpg",
                "email": "test@qq.com",
                "phone":"211234312",
                "city": null,
                "lastLogin": null,
                "roles": [
                    {
                        "id": 3,
                        "created": "2021-01-04T10:09:14",
                        "updated": "2021-01-30T08:19:52",
                        "status": 1,
                        "name": "普通用户",
                        "code": "normal",
                        "remark": "只有基本查看功能",
                        "menuIds": []
                    }
                ]
            }
        ],
        "total": 2,
        "size": 10,
        "current": 1,
        "orders": [],
        "optimizeCountSql": true,
        "hitCount": false,
        "countId": null,
        "maxLimit": null,
        "searchCount": true,
        "pages": 1
    }

    return Result
})


Mock.mock(RegExp('/sys/user/*'), 'post', () => {
    return Result
})

Mock.mock(RegExp('/sys/user/info/*'), 'get', () => {

    Result.data = {
        "id": 2,
        "created": "2021-01-30T08:20:22",
        "updated": "2021-01-30T08:55:57",
        "status": 1,
        "username": "test",
        "password": "$2a$10$0ilP4ZD1kLugYwLCs4pmb.ZT9cFqzOZTNaMiHxrBnVIQUGUwEvBIO",
        "avatar": "https://image-1300566513.cos.ap-guangzhou.myqcloud.com/upload/images/5a9f48118166308daba8b6da7e466aab.jpg",
        "email": "test@qq.com",
        "city": null,
        "lastLogin": null,
        "roles": [
            {
                "id": 6,
                "created": "2021-01-16T13:29:03",
                "updated": "2021-01-17T15:50:45",
                "status": 1,
                "name": "超级管理员",
                "code": "admin",
                "remark": "系统默认最高权限，不可以编辑和任意修改",
                "menuIds": []
            },
            {
                "id": 3,
                "created": "2021-01-04T10:09:14",
                "updated": "2021-01-30T08:19:52",
                "status": 1,
                "name": "普通用户",
                "code": "normal",
                "remark": "只有基本查看功能",
                "menuIds": []
            }
        ]
    }
    return Result
})

