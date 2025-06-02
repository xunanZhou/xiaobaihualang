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

// 引入腾讯云SDK
const cloud = require('wx-server-sdk')

// 🔧 初始化云环境
// DYNAMIC_CURRENT_ENV 表示使用当前的云环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 🗄️ 获取数据库实例
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
  // 🐛 调试日志：记录函数被调用
  console.log('🚀 用户登录云函数被调用')
  console.log('📥 接收到的参数：', event)
  
  try {
    // 📋 Step 1: 验证输入参数
    const { code, userInfo } = event
    
    // 检查必需的登录凭证
    if (!code) {
      console.error('❌ 缺少登录凭证code')
      return {
        success: false,
        message: '登录凭证不能为空',
        errorCode: 'MISSING_CODE'
      }
    }
    
    // 🔐 Step 2: 获取用户的微信身份信息
    console.log('🔍 开始获取用户微信身份信息...')
    
    // 通过云函数获取用户的openid和unionid
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID      // 用户在当前小程序的唯一标识
    const unionid = wxContext.UNIONID    // 用户在开发者账号下的唯一标识
    const appid = wxContext.APPID        // 小程序的appid
    
    console.log('✅ 成功获取用户身份信息：')
    console.log(`   - openid: ${openid}`)
    console.log(`   - unionid: ${unionid || '无'}`)
    console.log(`   - appid: ${appid}`)
    
    // 验证openid是否获取成功
    if (!openid) {
      console.error('❌ 无法获取用户openid')
      return {
        success: false,
        message: '身份验证失败，请重试',
        errorCode: 'INVALID_OPENID'
      }
    }
    
    // 🗄️ Step 3: 查询数据库中是否已存在该用户
    console.log('🔍 查询数据库中的用户记录...')
    
    const usersCollection = db.collection('users')
    const existingUserQuery = await usersCollection
      .where({
        openid: openid
      })
      .limit(1)
      .get()
    
    let userData
    let isNewUser = false
    
    if (existingUserQuery.data.length > 0) {
      // 👤 用户已存在，更新用户信息
      console.log('👤 用户已存在，更新用户信息')
      
      const existingUser = existingUserQuery.data[0]
      const userId = existingUser._id
      
      // 准备更新的数据
      const updateData = {
        lastLoginTime: new Date(),                           // 更新最后登录时间
        loginCount: db.command.inc(1)                       // 登录次数+1
      }
      
      // 如果提供了新的用户信息，也一并更新
      if (userInfo) {
        if (userInfo.nickName) {
          updateData.nickName = userInfo.nickName
        }
        if (userInfo.avatarUrl) {
          updateData.avatarUrl = userInfo.avatarUrl
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
      
      const newUserData = {
        // 🔐 身份信息
        openid: openid,
        unionid: unionid || null,
        appid: appid,
        
        // 👤 基本信息
        nickName: userInfo?.nickName || '新用户',
        avatarUrl: userInfo?.avatarUrl || '',
        
        // ⏰ 时间记录
        createTime: new Date(),
        lastLoginTime: new Date(),
        
        // 📊 统计数据
        loginCount: 1,
        stats: {
          artworksCount: 0,    // 创作作品数量
          likesReceived: 0,    // 收到的点赞数
          likesGiven: 0,       // 给出的点赞数
          activeDays: 1,       // 活跃天数
          totalCreateTime: 0   // 总创作时长(分钟)
        },
        
        // 🏆 成就系统
        achievements: [
          {
            id: 'newcomer',
            name: '新手上路',
            description: '欢迎加入AI画廊',
            unlockedAt: new Date(),
            icon: '🎉'
          }
        ],
        
        // ⚙️ 用户设置
        settings: {
          showRealName: false,        // 是否显示真实姓名
          allowShare: true,           // 是否允许分享作品
          notifications: true,        // 是否接收通知
          theme: 'auto',             // 主题设置: auto/light/dark
          language: 'zh-CN'          // 语言设置
        },
        
        // 🏷️ 用户标签
        tags: ['新用户'],
        
        // 🔒 权限等级
        userLevel: 'normal',  // normal/vip/admin
        
        // 📱 设备信息
        deviceInfo: {
          platform: context.platform || '',
          version: context.clientVersion || ''
        }
      }
      
      // 创建新用户记录
      const createResult = await usersCollection.add({
        data: newUserData
      })
      
      // 获取创建的用户完整数据
      userData = {
        _id: createResult._id,
        ...newUserData
      }
      
      console.log('✅ 新用户创建成功，用户ID：', createResult._id)
    }
    
    // 🎯 Step 4: 构造返回数据
    const responseData = {
      // 🆔 身份信息
      userId: userData._id,
      openid: userData.openid,
      
      // 👤 基本信息
      nickName: userData.nickName,
      avatarUrl: userData.avatarUrl,
      
      // 📊 统计信息
      stats: userData.stats,
      
      // 🏆 成就信息
      achievements: userData.achievements || [],
      
      // ⚙️ 设置信息
      settings: userData.settings,
      
      // 🏷️ 用户标签
      userLevel: userData.userLevel,
      tags: userData.tags || [],
      
      // 🕐 时间信息
      createTime: userData.createTime,
      lastLoginTime: userData.lastLoginTime,
      loginCount: userData.loginCount,
      
      // 🆕 是否为新用户
      isNewUser: isNewUser
    }
    
    console.log('🎉 登录成功，返回用户数据')
    
    // 📤 返回成功结果
    return {
      success: true,
      message: isNewUser ? '欢迎加入AI画廊！' : '欢迎回来！',
      data: responseData
    }
    
  } catch (error) {
    // 🚨 错误处理
    console.error('💥 登录过程中发生错误：', error)
    
    // 返回错误信息
    return {
      success: false,
      message: '登录失败，服务器错误',
      errorCode: 'SERVER_ERROR',
      error: error.message,
      // 🐛 开发环境下返回详细错误信息
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack
      })
    }
  }
}