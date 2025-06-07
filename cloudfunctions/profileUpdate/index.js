
//initiate the container once, and run the main function in container multiple times per user calls
//cloud init
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
  })
  
//database init
const db = cloud.database()


exports.main = async (event, context) => {
    console.log("profileUpdate cloud function called")
    console.log('📥 接收参数:', JSON.stringify(event, null, 2))

    //尝试执行
    try {
        const { avatarUrl } = event
    
        // 获取微信身份信息
        const wxContext = cloud.getWXContext()
        const openid = wxContext.OPENID
        
        console.log('🆔 用户openid:', openid)

        //更新数据库头像
        //没有open id
        if (!openid) {
            return {
            success: false,
            message: '身份验证失败',
            errorCode: 'INVALID_OPENID'
            }
        }
        
        //没有头像url
        if (!avatarUrl) {
            return {
            success: false,
            message: '头像URL不能为空',
            errorCode: 'MISSING_AVATAR_URL'
            }
        }

        //有open id 和头像url, 开始更新
        console.log('🖼️ 开始更新头像:', avatarUrl)

        const usersCollection = db.collection('users')
        // 查找用户
        const userQuery = await usersCollection
        .where({
            openid: openid
        })
        .limit(1)
        .get()
        
        if (userQuery.data.length === 0) {
            return {
                success: false,
                message: '用户不存在',
                errorCode: 'USER_NOT_FOUND'
            }
        }
        const userId = userQuery.data[0]._id
        console.log('👤 找到用户ID:', userId)
        
        // 更新头像
        const updateResult = await usersCollection.doc(userId).update({
          data: {
            avatarUrl: avatarUrl,
            lastUpdateTime: new Date()
          }
        })

        console.log('✅ 更新结果:', updateResult)

        // 获取更新后的用户数据
        const updatedUserQuery = await usersCollection.doc(userId).get()
        const updatedUserData = updatedUserQuery.data
        
        console.log('🎉 头像更新成功')
        console.log('========== 更新头像云函数结束 ==========')


        return {
            success: true,
            message: '头像更新成功',
            data: {
              userId: updatedUserData._id,
              avatarUrl: updatedUserData.avatarUrl,
              nickName: updatedUserData.nickName,
              lastUpdateTime: updatedUserData.lastUpdateTime
            }
        }

    } catch (error) {
        console.error('💥 更新头像出错:', error)
        console.log('========== 更新头像云函数异常结束 ==========')

        return {
            success: false,
            message: '服务器错误，更新失败',
            errorCode: 'SERVER_ERROR',
            error: error.message
        }
    }
} 
