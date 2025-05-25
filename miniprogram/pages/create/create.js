const app = getApp()

Page({
  data: {
    // 输入内容
    prompt: '',
    negativePrompt: '',
    maxLength: 500,
    
    // 风格选择
    artStyles: [
      {
        id: 'realistic',
        name: '写实',
        emoji: '📷',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      },
      {
        id: 'anime',
        name: '动漫',
        emoji: '🎭',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      },
      {
        id: 'oil',
        name: '油画',
        emoji: '🎨',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
      },
      {
        id: 'watercolor',
        name: '水彩',
        emoji: '🌈',
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
      },
      {
        id: 'sketch',
        name: '素描',
        emoji: '✏️',
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
      },
      {
        id: 'cyberpunk',
        name: '赛博朋克',
        emoji: '🤖',
        gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
      }
    ],
    selectedStyles: [],
    
    // 高级设置
    showAdvanced: false,
    selectedSize: '1:1',
    selectedQuality: 'standard',
    
    sizeOptions: [
      { label: '正方形', value: '1:1', ratio: '1024×1024' },
      { label: '横屏', value: '16:9', ratio: '1344×768' },
      { label: '竖屏', value: '9:16', ratio: '768×1344' },
      { label: '宽屏', value: '21:9', ratio: '1536×640' }
    ],
    
    qualityOptions: [
      { label: '标准', value: 'standard' },
      { label: '高清', value: 'hd' },
      { label: '超清', value: 'uhd' }
    ],
    
    // 生成状态
    isGenerating: false,
    progress: 0,
    progressText: '准备中...',
    generatedImages: [],
    selectedImageIndex: 0,
    
    // 示例提示词
    examplePrompts: [
      {
        id: 1,
        title: '梦幻风景',
        prompt: '一片梦幻的紫色薰衣草田，远山如黛，夕阳西下，天空中飘着粉色的云朵',
        emoji: '🌅'
      },
      {
        id: 2,
        title: '可爱动物',
        prompt: '一只毛茸茸的橘猫坐在窗台上，阳光透过窗户洒在它身上，温暖惬意',
        emoji: '🐱'
      },
      {
        id: 3,
        title: '科幻场景',
        prompt: '未来城市的夜景，霓虹灯闪烁，飞行汽车在空中穿梭，充满科技感',
        emoji: '🌃'
      },
      {
        id: 4,
        title: '抽象艺术',
        prompt: '色彩斑斓的抽象画，蓝色和金色的流动线条，充满动感和艺术气息',
        emoji: '🎨'
      },
      {
        id: 5,
        title: '人物肖像',
        prompt: '一位优雅的女性肖像，柔和的光线，细腻的表情，古典油画风格',
        emoji: '👩‍🎨'
      },
      {
        id: 6,
        title: '自然风光',
        prompt: '壮丽的雪山景色，清澈的湖水倒映着山峰，周围是茂密的森林',
        emoji: '🏔️'
      }
    ],
    
    // 帮助信息
    showHelpDialog: false,
    helpContent: '1. 详细描述画面内容，包括主体、环境、色彩等\n2. 选择合适的艺术风格\n3. 可以添加负面提示词来避免不想要的元素\n4. 生成后可以重新生成或直接发布'
  },

  onLoad(options) {
    // 获取系统信息
    this.getSystemInfo()
    
    // 检查是否有传入的提示词
    if (options.prompt) {
      this.setData({
        prompt: decodeURIComponent(options.prompt)
      })
    }
  },

  onShow() {
    // 页面显示时的逻辑
  },

  // 获取系统信息
  getSystemInfo() {
    const systemInfo = wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    })
  },

  // 返回按钮
  onBackTap() {
    if (this.data.isGenerating) {
      wx.showModal({
        title: '提示',
        content: '正在生成中，确定要离开吗？',
        success: (res) => {
          if (res.confirm) {
            wx.navigateBack()
          }
        }
      })
    } else {
      wx.navigateBack()
    }
  },

  // 帮助按钮
  onHelpTap() {
    this.setData({ showHelpDialog: true })
  },

  onHelpConfirm() {
    this.setData({ showHelpDialog: false })
  },

  // 输入相关方法
  onPromptChange(e) {
    this.setData({
      prompt: e.detail.value
    })
  },

  onNegativePromptChange(e) {
    this.setData({
      negativePrompt: e.detail.value
    })
  },

  onInputFocus() {
    // 输入框获得焦点时的处理
  },

  onInputBlur() {
    // 输入框失去焦点时的处理
  },

  onClearInput() {
    this.setData({ prompt: '' })
  },

  // 风格选择
  onStyleTap(e) {
    const style = e.currentTarget.dataset.style
    const selectedStyles = [...this.data.selectedStyles]
    
    const index = selectedStyles.indexOf(style.id)
    if (index > -1) {
      selectedStyles.splice(index, 1)
    } else {
      if (selectedStyles.length < 3) {
        selectedStyles.push(style.id)
      } else {
        this.showToast('最多选择3种风格', 'warning')
        return
      }
    }
    
    this.setData({ selectedStyles })
  },

  // 高级设置
  onToggleAdvanced() {
    this.setData({
      showAdvanced: !this.data.showAdvanced
    })
  },

  onSizeSelect(e) {
    const size = e.currentTarget.dataset.size
    this.setData({ selectedSize: size })
  },

  onQualitySelect(e) {
    const quality = e.currentTarget.dataset.quality
    this.setData({ selectedQuality: quality })
  },

  // 示例提示词
  onExampleTap(e) {
    const prompt = e.currentTarget.dataset.prompt
    this.setData({ prompt })
    this.showToast('已填入示例提示词', 'success')
  },

  // 生成相关方法
  onGenerateTap() {
    if (!this.data.prompt.trim()) {
      this.showToast('请输入创作描述', 'warning')
      return
    }

    // 检查登录状态
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.showModal({
        title: '需要登录',
        content: '请先登录后再进行创作',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/profile/profile'
            })
          }
        }
      })
      return
    }

    this.startGeneration()
  },

  // 开始生成
  startGeneration() {
    this.setData({
      isGenerating: true,
      progress: 0,
      progressText: '准备中...',
      generatedImages: []
    })

    // 模拟生成过程
    this.simulateGeneration()
  },

  // 模拟生成过程
  simulateGeneration() {
    const steps = [
      { progress: 10, text: '分析提示词...' },
      { progress: 30, text: '构建画面结构...' },
      { progress: 50, text: '渲染细节...' },
      { progress: 70, text: '应用艺术风格...' },
      { progress: 90, text: '优化画质...' },
      { progress: 100, text: '生成完成！' }
    ]

    let currentStep = 0
    const updateProgress = () => {
      if (currentStep < steps.length) {
        const step = steps[currentStep]
        this.setData({
          progress: step.progress,
          progressText: step.text
        })
        currentStep++
        setTimeout(updateProgress, 800)
      } else {
        // 生成完成
        this.completeGeneration()
      }
    }

    updateProgress()
  },

  // 完成生成
  completeGeneration() {
    // 模拟生成的图片
    const mockImages = [
      '/images/generated-1.jpg',
      '/images/generated-2.jpg',
      '/images/generated-3.jpg',
      '/images/generated-4.jpg'
    ]

    this.setData({
      isGenerating: false,
      generatedImages: mockImages,
      selectedImageIndex: 0
    })

    this.showToast('生成完成！', 'success')
  },

  // 重新生成
  onRegenerateTap() {
    wx.showModal({
      title: '重新生成',
      content: '确定要重新生成吗？',
      success: (res) => {
        if (res.confirm) {
          this.startGeneration()
        }
      }
    })
  },

  // 图片选择
  onImageSelect(e) {
    const index = e.currentTarget.dataset.index
    this.setData({ selectedImageIndex: index })
  },

  // 发布作品
  onPublishTap() {
    if (this.data.generatedImages.length === 0) {
      this.showToast('请先生成图片', 'warning')
      return
    }

    const selectedImage = this.data.generatedImages[this.data.selectedImageIndex]
    
    wx.showLoading({ title: '发布中...' })
    
    // 模拟发布过程
    setTimeout(() => {
      wx.hideLoading()
      
      // 保存作品到本地存储和全局数据
      const artworkData = this.saveArtwork(selectedImage)
      
      // 跳转到成功页面，传递作品数据
      wx.redirectTo({
        url: `/pages/create-success/create-success?artworkData=${encodeURIComponent(JSON.stringify(artworkData))}`
      })
    }, 2000)
  },

  // 保存作品
  saveArtwork(imageUrl) {
    const artwork = {
      id: Date.now(),
      prompt: this.data.prompt,
      imageUrl: imageUrl,
      styles: this.data.selectedStyles,
      size: this.data.selectedSize,
      quality: this.data.selectedQuality,
      createTime: new Date().toISOString(),
      author: getApp().globalData.userInfo?.nickName || '匿名用户',
      likes: 0
    }

    // 添加到全局数据
    getApp().addArtwork(artwork)
    
    // 更新用户统计
    this.updateUserStats()
    
    return artwork
  },

  // 更新用户统计
  updateUserStats() {
    let userStats = wx.getStorageSync('userStats') || {
      artworks: 0,
      likes: 0,
      days: 1
    }
    
    userStats.artworks += 1
    wx.setStorageSync('userStats', userStats)
  },

  // 显示Toast提示
  showToast(message, type = 'info') {
    const toast = this.selectComponent('#t-toast')
    if (toast) {
      toast.showToast({
        theme: type,
        message: message,
        duration: 2000
      })
    } else {
      wx.showToast({
        title: message,
        icon: type === 'success' ? 'success' : 'none',
        duration: 2000
      })
    }
  },

  // 页面分享
  onShareAppMessage() {
    return {
      title: '我在AI画廊创作了一幅作品',
      path: '/pages/home/home',
      imageUrl: '/images/share-cover.jpg'
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: 'AI画廊 - 用AI创作属于你的艺术作品',
      imageUrl: '/images/share-cover.jpg'
    }
  }
}) 