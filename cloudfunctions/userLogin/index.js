// cloudfunctions/userLogin/index.js

/**
 * 🎯 用户登录云函数
 * 
 * 🔥 核心功能：
 * 1. 接收小程序的登录请求
 * 2. 验证用户身份并获取openid
 * 3. 在数据库中创建或更新用户记录
 * 4. 返回完整的用户信息
 * 
 * 🚀 调用方式：
 * wx.cloud.callFunction({
 *   name: 'userLogin',
 *   data: { code: 'xxx', userInfo: {...} }
 * })
 */

// 引入云函数SDK

// 初始化云环境
// 这告诉云函数要连接到哪个云环境

// 获取数据库引用
// 这样我们就可以操作数据库了

// 引入腾讯云SDK
// 需要引入wx-server-sdk模块

// 🔧 初始化云环境
// 需要使用cloud.init()初始化，并设置env为当前环境

// 🗄️ 获取数据库实例
// 需要获取数据库引用以便操作数据库

/**
 * 🚀 云函数主入口
 * 
 * @param {Object} event - 小程序传递的数据
 * @param {string} event.code - 微信登录凭证
 * @param {Object} event.userInfo - 用户基本信息(昵称、头像)
 * @param {Object} context - 云函数运行环境

 * 需要实现的功能:
 * 1. 验证输入参数(code必需)
 * 2. 获取用户微信身份信息(openid, unionid)
 * 3. 查询数据库是否存在用户
 * 4. 如果存在则更新用户信息
 * 5. 如果不存在则创建新用户
 * 6. 返回用户数据
 * 
 * 返回数据格式:
 * {
 *   success: boolean,
 *   message: string,
 *   data: {
 *     userId: string,
 *     openid: string,
 *     nickName: string,
 *     avatarUrl: string,
 *     stats: Object,
 *     achievements: Array,
 *     settings: Object,
 *     userLevel: string,
 *     tags: Array,
 *     createTime: Date,
 *     lastLoginTime: Date,
 *     loginCount: number,
 *     isNewUser: boolean
 *   }
 * }
 * 
 * 错误处理:
 * - 缺少code时返回MISSING_CODE错误
 * - 无法获取openid时返回INVALID_OPENID错误
 * - 服务器错误时返回SERVER_ERROR错误
 */

// 1 Setup and initiation
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

/**
 * 🚀 云函数主入口
 * 
 * @param {Object} event - 小程序传递的数据
 * @param {string} event.code - 微信登录凭证
 * @param {Object} event.userInfo - 用户基本信息(昵称、头像)
 * @param {Object} context - 云函数运行环境
 */


exports.main = async (event, context) => {
    console.log("uselogin 云函数被调用")
    console.log("event: ", event)
    try {
        const { code, userInfo, deviceInfo } = event
        
        // 2 get code from event
        if (!code) {
            console.log("no code provided")
            return{
                success: false,
                message: "no code provided",
                errorCode: "MISSING_CODE"
            }
        }

        // 3 get user info from event
        const wxcontext = cloud.getWXContext() //??? what's the cloud.getWXContext() usage here
        const openid = wxcontext.OPENID
        const unionid = wxcontext.UNIONID
        const appid = wxcontext.APPID

        console.log("openid: ", openid)
        console.log("unionid: ", unionid)
        console.log("appid: ", appid)


        // 验证openid是否获取成功
        if (!openid) {
            console.error('❌ 无法获取用户openid')
            return {
            success: false,
            message: '身份验证失败，请重试',
            errorCode: 'INVALID_OPENID'
            }
        }

          // 🗄️ Step 6: 查询数据库中是否已存在该用户
        console.log('🔍 查询数据库中的用户记录...')
        
        const usersCollection = db.collection('users')
        const existingUserQuery = await usersCollection
        .where({
            openid: openid  // 查询条件：openid匹配
        })
        .limit(1)         // 限制返回1条记录
        .get()            // 执行查询
        
        let userData
        let isNewUser = false

        if (existingUserQuery.data.length > 0) {
            // 👤 用户已存在，更新用户信息
            console.log('👤 用户已存在，更新用户信息')
            
            const existingUser = existingUserQuery.data[0]
            const userId = existingUser._id

            // 准备更新的数据
            const updateData = {
                    lastLoginTime: new Date(), // 更新最后登录时间
                    loginCount: db.command.inc(1), // 登录次数+1
                    deviceInfo: deviceInfo         
                    //TODO 更新头像和nickname             
                }

             // 🔥 智能更新用户信息
            if (userInfo) {
                // 昵称可以随时更新
                if (userInfo.nickName) {
                    updateData.nickName = userInfo.nickName
                }
                
                // 🎯 头像更新的智能逻辑
                if (userInfo.avatarUrl) {
                    const currentAvatar = existingUser.avatarUrl
                    
                    // 判断当前头像是否为自定义头像（云存储URL）
                    const isCustomAvatar = currentAvatar && currentAvatar.startsWith('cloud://')
                    
                    console.log('🖼️ 头像更新检查:')
                    console.log('  - 当前头像:', currentAvatar)
                    console.log('  - 新头像:', userInfo.avatarUrl)
                    console.log('  - 是否自定义头像:', isCustomAvatar)
                    
                    if (!isCustomAvatar) {
                        // 只有在没有自定义头像时才更新为微信头像
                        updateData.avatarUrl = userInfo.avatarUrl
                        console.log('  - ✅ 使用微信默认头像')
                    } else {
                        console.log('  - 🛡️ 保护自定义头像，不覆盖')
                    }
                }
            }

            // 执行更新操作
            await usersCollection.doc(userId).update({
                    data: updateData
                })
                
            // 获取更新后的完整用户数据
            const updatedUserQuery = await usersCollection.doc(userId).get()
            userData = updatedUserQuery.data
            
            console.log('✅ 用户信息更新成功')
                
            } else {
                    // 🆕 新用户，创建用户记录
                    console.log('🆕 检测到新用户，创建用户记录')
                    isNewUser = true


                     // 构造新用户的完整数据结构
                    const newUserData = {
                        // 🔐 身份信息
                        openid: openid,
                        unionid: unionid || null,
                        appid: appid,

                        // 👤 基本信息
                        nickName: userInfo?.nickName || '新用户',
                        avatarUrl: userInfo?.avatarUrl || '',
                        
                        // ⏰ 时间记录
                        createTime: new Date(),     // 账号创建时间
                        lastLoginTime: new Date(),  // 最后登录时间
                        
                        // 📊 统计数据
                        loginCount: 1,
                        stats: {
                        artworksCount: 0,    // 创作作品数量
                        likesReceived: 0,    // 收到的点赞数
                        likesGiven: 0,       // 给出的点赞数  
                        activeDays: 1,       // 活跃天数
                        totalCreateTime: 0   // 总创作时长(分钟)
                        },
                        
                        
                          // 🔥 云函数执行环境信息（用于调试）
                        cloudContext: {
                            requestId: context.REQUESTID,
                            memoryLimit: context.MEMORY_LIMIT_IN_MB,
                            timeLimit: context.TIME_LIMIT_IN_MS,
                            executionTime: new Date()
                        },

                        // 🔥 使用从前端传递的设备信息
                        deviceInfo: {
                            platform: deviceInfo?.platform || 'unknown',
                            version: deviceInfo?.version || 'unknown',
                            system: deviceInfo?.system || 'unknown',
                            model: deviceInfo?.model || 'unknown',
                            brand: deviceInfo?.brand || 'unknown',
                            SDKVersion: deviceInfo?.SDKVersion || 'unknown',
                            screenResolution: `${deviceInfo?.screenWidth || 0}x${deviceInfo?.screenHeight || 0}`,
                            language: deviceInfo?.language || 'zh-CN',
                            recordTime: new Date()
                        },
                    }
                
                     // 在数据库中创建新用户记录
                    const createResult = await usersCollection.add({
                        data: newUserData
                    })

                    // 获取创建的用户完整数据(包含数据库生成的_id) 并且更新userData
                    userData = {
                        _id: createResult._id,
                        ...newUserData
                    }
                    console.log('✅ 新用户创建成功，用户ID：', createResult._id)
                }
                
                // 🎯 Step 7: 构造返回给小程序端的数据
                const responseData = {
                    // 🆔 身份信息  
                    userId: userData._id,
                    openid: userData.openid,
                    unionid: userData.unionid,
                    
                    // 👤 基本信息
                    nickName: userData.nickName,
                    avatarUrl: userData.avatarUrl,
                    
                    // 📊 统计信息
                    stats: userData.stats,
                    
                    // 🕐 时间信息
                    createTime: userData.createTime,
                    lastLoginTime: userData.lastLoginTime,
                    loginCount: userData.loginCount,
                    
                    // 🆕 是否为新用户标识
                    isNewUser: isNewUser
                }
                console.log('🎉 执行完用户信息构造 准备返回')
                console.log('📤 返回数据预览：', {
                    userId: responseData.userId,
                    openid: responseData.openid,
                    nickName: responseData.nickName,
                    isNewUser: responseData.isNewUser,
                    avatarUrl: responseData.avatarUrl
                  })

                   // 📤 返回成功结果给小程序端
                return {
                    success: true,
                    message: isNewUser ? '欢迎加入AI画廊！' : '欢迎回来！',
                    data: responseData
                }

    } catch (error) { //4 error handling 
        console.error("error: ", error)
        return {
            success: false,
            message: "server error",
            errorCode: "SEVER_ERROR",
            error: error.message,
            // 开发环境下返回详细错误信息
            ...(process.env.NODE_ENV === 'development' && { //??? what's process? what's NODE_ENV? Why === 'development
                stack: error.stack // why stack? why error.stack?
            })
        }
    }
}
