const app = getApp()

Page({
  data: {
    artworkData: null,
    userStats: {
      artworks: 0,
      likes: 0,
      days: 0
    },
    newAchievement: null,
    showShareDialog: false,
    shareDialogContent: '',
    shareOptions: [
      {
        id: 1,
        type: 'wechat',
        label: '微信',
        icon: 'wechat',
        bgColor: '#07c160',
        iconColor: '#ffffff'
      },
      {
        id: 2,
        type: 'moments',
        label: '朋友圈',
        icon: 'share',
        bgColor: '#1aad19',
        iconColor: '#ffffff'
      },
      {
        id: 3,
        type: 'weibo',
        label: '微博',
        icon: 'logo-weibo',
        bgColor: '#e6162d',
        iconColor: '#ffffff'
      },
      {
        id: 4,
        type: 'copy',
        label: '复制链接',
        icon: 'link',
        bgColor: '#666666',
        iconColor: '#ffffff'
      }
    ],
    inspirations: [
      {
        id: 1,
        emoji: '🌙',
        title: '夜景系列',
        desc: '星空下的城市夜景，灯火通明，现代都市风格',
        prompt: '星空下的城市夜景，灯火通明，现代都市风格，高清细节'
      },
      {
        id: 2,
        emoji: '🌺',
        title: '花卉系列',
        desc: '盛开的向日葵田，金黄色的花海，温暖明亮',
        prompt: '盛开的向日葵田，金黄色的花海，温暖明亮，油画风格'
      },
      {
        id: 3,
        emoji: '🏔️',
        title: '自然风光',
        desc: '雪山湖泊，倒影清晰，宁静致远的意境',
        prompt: '雪山湖泊，倒影清晰，宁静致远的意境，风景摄影'
      },
      {
        id: 4,
        emoji: '🎨',
        title: '抽象艺术',
        desc: '色彩斑斓的抽象画，充满想象力和创意',
        prompt: '色彩斑斓的抽象画，充满想象力和创意，现代艺术风格'
      }
    ]
  },

  onLoad(options) {
    // 获取传递的作品数据
    if (options.artworkData) {
      try {
        const artworkData = JSON.parse(decodeURIComponent(options.artworkData))
        this.setData({ artworkData })
      } catch (error) {
        console.error('解析作品数据失败:', error)
        this.loadDefaultArtwork()
      }
    } else {
      this.loadDefaultArtwork()
    }

    // 加载用户统计数据
    this.loadUserStats()
    
    // 检查是否有新成就
    this.checkNewAchievement()
  },

  onShow() {
    // 页面显示时刷新数据
    this.loadUserStats()
  },

  // 加载默认作品数据（用于测试）
  loadDefaultArtwork() {
    const defaultArtwork = {
      id: Date.now(),
      prompt: '一只橘色的小猫咪在樱花树下打盹，春日午后，温暖的阳光，日系插画风格',
      imageUrl: 'https://picsum.photos/400/600?random=' + Date.now(),
      author: app.globalData.userInfo?.nickName || '张小艺',
      createTime: new Date().toISOString()
    }
    this.setData({ artworkData: defaultArtwork })
  },

  // 加载用户统计数据
  loadUserStats() {
    const userArtworks = app.globalData.userArtworks || []
    const totalLikes = userArtworks.reduce((sum, artwork) => sum + (artwork.likes || 0), 0)
    
    // 计算连续创作天数（简化计算）
    const today = new Date()
    const recentDays = new Set()
    userArtworks.forEach(artwork => {
      const createDate = new Date(artwork.createTime)
      const daysDiff = Math.floor((today - createDate) / (1000 * 60 * 60 * 24))
      if (daysDiff <= 7) {
        recentDays.add(daysDiff)
      }
    })

    this.setData({
      userStats: {
        artworks: userArtworks.length,
        likes: totalLikes,
        days: Math.max(recentDays.size, 1)
      }
    })
  },

  // 检查新成就
  checkNewAchievement() {
    const userArtworks = app.globalData.userArtworks || []
    const artworkCount = userArtworks.length
    
    let newAchievement = null
    
    if (artworkCount === 1) {
      newAchievement = {
        name: '初出茅庐',
        desc: '发布第一个作品'
      }
    } else if (artworkCount === 5) {
      newAchievement = {
        name: '小有成就',
        desc: '发布5个作品'
      }
    } else if (artworkCount === 10) {
      newAchievement = {
        name: '多产创作者',
        desc: '发布超过10个作品'
      }
    } else if (artworkCount === 20) {
      newAchievement = {
        name: '艺术大师',
        desc: '发布超过20个作品'
      }
    }
    
    if (newAchievement) {
      this.setData({ newAchievement })
    }
  },

  // 返回按钮
  onBackTap() {
    wx.navigateBack({
      delta: 1,
      fail: () => {
        // 如果无法返回，则跳转到首页
        wx.switchTab({
          url: '/pages/home/home'
        })
      }
    })
  },

  // 返回首页
  onBackHomeTap() {
    wx.switchTab({
      url: '/pages/home/home'
    })
  },

  // 继续创作
  onContinueCreateTap() {
    wx.navigateTo({
      url: '/pages/create/create'
    })
  },

  // 分享作品
  onShareTap(e) {
    const shareType = e.currentTarget.dataset.type
    const artwork = this.data.artworkData
    
    switch (shareType) {
      case 'wechat':
        this.shareToWechat()
        break
      case 'moments':
        this.shareToMoments()
        break
      case 'weibo':
        this.shareToWeibo()
        break
      case 'copy':
        this.copyLink()
        break
      default:
        this.showToast('分享功能开发中', 'info')
    }
  },

  // 分享到微信
  shareToWechat() {
    this.setData({
      showShareDialog: true,
      shareDialogContent: '是否分享作品到微信好友？'
    })
  },

  // 分享到朋友圈
  shareToMoments() {
    this.setData({
      showShareDialog: true,
      shareDialogContent: '是否分享作品到微信朋友圈？'
    })
  },

  // 分享到微博
  shareToWeibo() {
    this.showToast('微博分享功能开发中', 'info')
  },

  // 复制链接
  copyLink() {
    const artwork = this.data.artworkData
    const shareText = `我在AI画廊创作了一幅作品：${artwork.prompt}`
    
    wx.setClipboardData({
      data: shareText,
      success: () => {
        this.showToast('链接已复制到剪贴板', 'success')
      },
      fail: () => {
        this.showToast('复制失败，请重试', 'error')
      }
    })
  },

  // 确认分享
  onConfirmShare() {
    this.setData({ showShareDialog: false })
    this.showToast('分享成功', 'success')
  },

  // 取消分享
  onCancelShare() {
    this.setData({ showShareDialog: false })
  },

  // 点击创作灵感
  onInspirationTap(e) {
    const prompt = e.currentTarget.dataset.prompt
    
    wx.showModal({
      title: '使用此灵感创作',
      content: `是否使用"${prompt}"作为提示词开始创作？`,
      confirmText: '开始创作',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // 跳转到创作页面并传递提示词
          wx.navigateTo({
            url: `/pages/create/create?prompt=${encodeURIComponent(prompt)}`
          })
        }
      }
    })
  },

  // 显示提示信息
  showToast(message, type = 'info') {
    const toastTypes = {
      success: {
        theme: 'success',
        direction: 'column',
        icon: 'check-circle'
      },
      error: {
        theme: 'error',
        direction: 'column',
        icon: 'close-circle'
      },
      warning: {
        theme: 'warning',
        direction: 'column',
        icon: 'error-circle'
      },
      info: {
        theme: 'info',
        direction: 'column',
        icon: 'info-circle'
      }
    }

    const config = toastTypes[type] || toastTypes.info

    this.selectComponent('#t-toast').showToast({
      ...config,
      message: message,
      duration: 2000
    })
  },

  // 分享给好友
  onShareAppMessage() {
    const artwork = this.data.artworkData
    return {
      title: `我在AI画廊创作了一幅作品：${artwork.prompt}`,
      path: `/pages/home/home`,
      imageUrl: artwork.imageUrl
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    const artwork = this.data.artworkData
    return {
      title: `AI画廊 - ${artwork.prompt}`,
      imageUrl: artwork.imageUrl
    }
  }
}) 