// cloudfunctions/imageGeneration/index.js
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
  })

const db = cloud.database()

// 通义万相API配置
const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY 
// || 'sk-e7a00f1731274c1a86217b872ce41f9e'
const API_BASE_URL = 'https://dashscope.aliyuncs.com/api/v1'


// 添加错误检查
if (!DASHSCOPE_API_KEY) {
  console.error('DASHSCOPE_API_KEY 环境变量未设置')
  throw new Error('API密钥未配置')
}

// 主函数入口
exports.main = async (event, context) => {
  console.log('API密钥已配置:', DASHSCOPE_API_KEY ? '✓' : '✗')
  const { name, ...params } = event
  

  
  try {
    switch (name) {
      case 'createTask':
        return await createTask(params, context)
      case 'queryTask':
        return await queryTask(params, context)
      case 'saveImage':
        return await saveImage(params, context)
      case 'getUserHistory':
        return await getUserHistory(params, context)
      default:
        throw new Error(`Unknown function name: ${name}`)
    }
  } catch (error) {
    console.error('Cloud function error:', error)
    return {
      success: false,
      error: error.message,
      code: error.code || 'UNKNOWN_ERROR'
    }
  }
}

// 创建文生图任务
async function createTask(params, context) {
  const { prompt, style, openid } = params
  
  // 构建完整的提示词
  const fullPrompt = buildPromptWithStyle(prompt, style)
  
  try {
    // 调用通义万相API创建任务
    const response = await axios.post(
      `${API_BASE_URL}/services/aigc/text2image/image-synthesis`,
      {
        model: 'wanx2.1-t2i-turbo',
        input: {
          prompt: fullPrompt
        },
        parameters: {
          size: '1024*1024',
          n: 1,
          prompt_extend: true,
          watermark: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
          'Content-Type': 'application/json',
          'X-DashScope-Async': 'enable'
        }
      }
    )
    
    const { task_id, task_status } = response.data.output
    
    // 保存任务记录到数据库
    await db.collection('generation_tasks').add({
      data: {
        taskId: task_id,
        openid: openid,
        prompt: prompt,
        style: style,
        fullPrompt: fullPrompt,
        status: task_status,
        createTime: new Date(),
        updateTime: new Date()
      }
    })
    
    return {
      success: true,
      data: {
        taskId: task_id,
        status: task_status
      }
    }
    
  } catch (error) {
    console.error('Create task error:', error.response?.data || error.message)
    throw new Error(`创建任务失败: ${error.response?.data?.message || error.message}`)
  }
}

// 查询任务结果
async function queryTask(params, context) {
  const { taskId } = params

  const wxcontext = cloud.getWXContext() //??? what's the cloud.getWXContext() usage here
  const openid = wxcontext.OPENID
  console.log(`📋 查询任务 - TaskID: ${taskId}, OpenID: ${openid}`)

  
  try {
    // 查询通义万相API任务状态
    const response = await axios.get(
      `${API_BASE_URL}/tasks/${taskId}`,
      {
        headers: {
          'Authorization': `Bearer ${DASHSCOPE_API_KEY}`
        }
      }
    )
    
    const taskData = response.data.output
    const { task_status, results } = taskData
    
    // 更新数据库中的任务状态
    await db.collection('generation_tasks')
      .where({ taskId: taskId, openid: openid })
      .update({
        data: {
          status: task_status,
          updateTime: new Date(),
          ...(results && { results: results }) //todo： 这个写法太简洁了 需要学一下
        }
      })
    
      console.log(`📋 当前状态: ${task_status}`)
    // 如果任务成功完成，自动保存图片
    if (task_status === 'SUCCEEDED' && results && results.length > 0) {
      const imageUrl = results[0].url
      const savedImage = await saveImageToCloud(imageUrl, taskId, openid)
      
      return {
        success: true,
        data: {
          status: task_status,
          imageUrl: savedImage.fileID,        // 🔧 修复：使用 savedImage.fileID
          originalUrl: imageUrl,
          saved: true,                        // 明确标示已保存
          fileName: savedImage.fileName,
          taskData: taskData
        }
      }
    }
    
    return {
      success: true,
      data: {
        status: task_status,
        taskData: taskData
      }
    }
    
  } catch (error) {
    console.error('Query task error:', error.response?.data || error.message)
    throw new Error(`查询任务失败: ${error.response?.data?.message || error.message}`)
  }
}

// 保存图片到云存储
async function saveImageToCloud(imageUrl, taskId, openid) {
  try {
    // 下载图片
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 60000, // 增加下载超时时间
      maxContentLength: 50 * 1024 * 1024 // 最大50MB
    })
    
    const buffer = Buffer.from(response.data)
    const timestamp = new Date().getTime()
    const fileName = `${openid}_${taskId}_${timestamp}.png`
    const cloudPath = `artworks/${fileName}`

    
    // 上传到云存储
    const uploadResult = await cloud.uploadFile({
      cloudPath: cloudPath,
      fileContent: buffer
    })
    
    console.log(`💾 保存图片到云存储:`, JSON.stringify(uploadResult))

    // 保存到用户历史记录
    // 🔧 修复4: 保存到数据库时使用正确的字段
    const artworkData = {
      openid: openid,
      taskId: taskId,
      fileID: uploadResult.fileID,        // 🔧 统一使用 fileID
      cloudPath: uploadResult.cloudPath,
      originalUrl: imageUrl,
      fileName: fileName,
      createTime: new Date(),
      status: 'completed'
    }
    await db.collection('artworks').add({
      data: artworkData
    })
    
    return {
      cloudUrl: uploadResult.cloudPath,
      fileName: fileName,
      uploadResult: uploadResult
    }
    
  } catch (error) {
    console.error('Save image error:', error)
    throw new Error(`保存图片失败: ${error.message}`)
  }
}

// 获取用户历史记录
async function getUserHistory(params, context) {
  const { openid, page = 1, limit = 20 } = params
  
  try {
    const result = await db.collection('user_artworks')
      .where({ openid: openid })
      .orderBy('createTime', 'desc')
      .skip((page - 1) * limit)
      .limit(limit)
      .get()
    
    return {
      success: true,
      data: {
        artworks: result.data,
        total: result.data.length,
        page: page
      }
    }
    
  } catch (error) {
    console.error('Get user history error:', error)
    throw new Error(`获取历史记录失败: ${error.message}`)
  }
}

// 根据风格构建完整提示词
function buildPromptWithStyle(prompt, style) {
  const styleMap = {
    'realistic': `${prompt}, 写实摄影风格, 高清细节, 专业摄影`,
    'anime': `${prompt}, 日本动漫风格, 精美插画, 二次元`,
    'oil': `${prompt}, 经典油画风格, 厚涂技法, 艺术大师作品`,
    'watercolor': `${prompt}, 水彩画风格, 淡雅色彩, 流畅笔触`,
    'sketch': `${prompt}, 素描风格, 铅笔画, 黑白线条`,
    'cyberpunk': `${prompt}, 赛博朋克风格, 霓虹灯光, 未来科技感`
  }
  
  return styleMap[style] || `${prompt}, 高质量艺术作品`
}