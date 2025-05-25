const app = getApp()

Page({
  data: {
    // 登录状态
    isLoggedIn: false,
    showLoginDialog: false,
    
    // 用户信息
    userInfo: {
      nickName: '张小艺',
      avatarUrl: '/images/avatar-default.png'
    },
    
    // 用户统计
    userStats: {
      artworks: 12,
      likes: 156,
      days: 7
    },
    
    // 成就徽章
    achievements: [
      { name: '新手画家', theme: 'primary' },
      { name: '活跃创作者', theme: 'success' }
    ],
    
    // 快捷操作
    quickActions: [
      {
        id: 'create',
        label: '创作',
        icon: 'add-circle',
        iconColor: '#ffffff',
        bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      },
      {
        id: 'collection',
        label: '收藏',
        icon: 'heart',
        iconColor: '#ff4757',
        bgColor: 'rgba(255, 71, 87, 0.1)'
      },
      {
        id: 'stats',
        label: '统计',
        icon: 'chart-bar',
        iconColor: '#5352ed',
        bgColor: 'rgba(83, 82, 237, 0.1)'
      },
      {
        id: 'settings',
        label: '设置',
        icon: 'setting',
        iconColor: '#666666',
        bgColor: 'rgba(102, 102, 102, 0.1)'
      }
    ],
    
    // 个人作品
    userArtworks: [
      {
        id: 1,
        prompt: '梦幻森林中的精灵',
        imageUrl: '/images/artwork-1.jpg',
        likes: 23,
        timeAgo: '2小时前',
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        prompt: '未来城市的霓虹夜景',
        imageUrl: '/images/artwork-2.jpg',
        likes: 45,
        timeAgo: '1天前',
        createdAt: '2024-01-14'
      },
      {
        id: 3,
        prompt: '古典油画风格的猫咪',
        imageUrl: '/images/artwork-3.jpg',
        likes: 67,
        timeAgo: '3天前',
        createdAt: '2024-01-12'
      },
      {
        id: 4,
        prompt: '抽象艺术的色彩碰撞',
        imageUrl: '/images/artwork-4.jpg',
        likes: 21,
        timeAgo: '5天前',
        createdAt: '2024-01-10'
      }
    ],
    
    // 未登录状态数据
    features: [
      {
        id: 1,
        title: 'AI创作',
        desc: '无限创意可能',
        icon: '🎨',
        bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      },
      {
        id: 2,
        title: '作品收藏',
        desc: '保存喜爱作品',
        icon: '❤️',
        bgColor: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'
      },
      {
        id: 3,
        title: '社区互动',
        desc: '与创作者交流',
        icon: '💬',
        bgColor: 'linear-gradient(135deg, #0abde3 0%, #006ba6 100%)'
      },
      {
        id: 4,
        title: '成就系统',
        desc: '记录创作历程',
        icon: '🏆',
        bgColor: 'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)'
      }
    ],
    
    // 热门作品预览
    previewArtworks: [
      { id: 1, title: '星空', color: '#667eea' },
      { id: 2, title: '海洋', color: '#0abde3' },
      { id: 3, title: '森林', color: '#55a3ff' },
      { id: 4, title: '城市', color: '#5f27cd' },
      { id: 5, title: '花园', color: '#00d2d3' },
      { id: 6, title: '山峰', color: '#ff9ff3' }
    ],
    
    // 创作灵感
    inspirations: [
      {
        id: 1,
        title: '风景画',
        desc: '自然美景的艺术呈现',
        emoji: '🏞️'
      },
      {
        id: 2,
        title: '人物肖像',
        desc: '捕捉人物神韵与情感',
        emoji: '👤'
      },
      {
        id: 3,
        title: '抽象艺术',
        desc: '色彩与形状的自由表达',
        emoji: '🎭'
      },
      {
        id: 4,
        title: '科幻场景',
        desc: '未来世界的想象空间',
        emoji: '🚀'
      }
    ]
  },

  // 计算属性
  get displayArtworks() {
    return this.data.userArtworks.slice(0, 4)
  },

  onLoad(options) {
    // 检查登录状态
    this.checkLoginStatus()
    
    // 获取系统信息
    this.getSystemInfo()
  },

  onShow() {
    // 页面显示时刷新数据
    if (this.data.isLoggedIn) {
      this.refreshUserData()
    }
  },

  // 检查登录状态
  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        isLoggedIn: true,
        userInfo: userInfo
      })
      this.loadUserData()
    }
  },

  // 获取系统信息
  getSystemInfo() {
    const systemInfo = wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    })
  },

  // 加载用户数据
  loadUserData() {
    // 模拟加载用户统计数据
    setTimeout(() => {
      this.setData({
        userStats: {
          artworks: Math.floor(Math.random() * 50) + 10,
          likes: Math.floor(Math.random() * 500) + 100,
          days: Math.floor(Math.random() * 30) + 1
        }
      })
    }, 500)
    
    // 加载用户作品
    this.loadUserArtworks()
  },

  // 加载用户作品
  loadUserArtworks() {
    // 模拟API调用
    wx.showLoading({ title: '加载中...' })
    
    setTimeout(() => {
      wx.hideLoading()
      // 这里应该是真实的API调用
      console.log('用户作品加载完成')
    }, 1000)
  },

  // 刷新用户数据
  refreshUserData() {
    if (!this.data.isLoggedIn) return
    
    this.loadUserData()
  },

  // 登录相关方法
  onLoginTap() {
    this.setData({ showLoginDialog: true })
  },

  onConfirmLogin() {
    this.setData({ showLoginDialog: false })
    this.performLogin()
  },

  onCancelLogin() {
    this.setData({ showLoginDialog: false })
  },

  // 执行登录
  performLogin() {
    wx.showLoading({ title: '登录中...' })
    
    // 获取用户信息
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        console.log('获取用户信息成功', res)
        
        // 模拟登录API调用
        setTimeout(() => {
          wx.hideLoading()
          
          // 保存用户信息
          const userInfo = res.userInfo
          wx.setStorageSync('userInfo', userInfo)
          
          this.setData({
            isLoggedIn: true,
            userInfo: userInfo
          })
          
          // 加载用户数据
          this.loadUserData()
          
          // 显示成功提示
          this.showToast('登录成功！', 'success')
          
        }, 1500)
      },
      fail: (err) => {
        wx.hideLoading()
        console.error('获取用户信息失败', err)
        this.showToast('登录失败，请重试', 'error')
      }
    })
  },

  // 设置按钮点击
  onSettingsTap() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    })
  },

  // 功能卡片点击
  onFeatureTap(e) {
    const feature = e.currentTarget.dataset.feature
    console.log('功能点击:', feature)
    
    // 引导用户登录
    this.showToast('请先登录体验完整功能', 'info')
    setTimeout(() => {
      this.onLoginTap()
    }, 1500)
  },

  // 预览作品点击
  onPreviewTap() {
    this.showToast('请登录查看更多作品', 'info')
    setTimeout(() => {
      this.onLoginTap()
    }, 1500)
  },

  // 快捷操作点击
  onActionTap(e) {
    const action = e.currentTarget.dataset.action
    console.log('快捷操作:', action)
    
    switch (action.id) {
      case 'create':
        wx.navigateTo({
          url: '/pages/create/create'
        })
        break
      case 'collection':
        wx.navigateTo({
          url: '/pages/collection/collection'
        })
        break
      case 'stats':
        wx.navigateTo({
          url: '/pages/stats/stats'
        })
        break
      case 'settings':
        wx.navigateTo({
          url: '/pages/settings/settings'
        })
        break
      default:
        this.showToast('功能开发中...', 'info')
    }
  },

  // 作品点击
  onArtworkTap(e) {
    const artwork = e.currentTarget.dataset.artwork
    console.log('作品点击:', artwork)
    
    wx.navigateTo({
      url: `/pages/artwork-detail/artwork-detail?id=${artwork.id}`
    })
  },

  // 查看全部作品
  onViewAllTap() {
    wx.navigateTo({
      url: '/pages/my-artworks/my-artworks'
    })
  },

  // 开始创作
  onCreateTap() {
    wx.navigateTo({
      url: '/pages/create/create'
    })
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

  // 下拉刷新
  onPullDownRefresh() {
    if (this.data.isLoggedIn) {
      this.refreshUserData()
    }
    
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1500)
  },

  // 页面分享
  onShareAppMessage() {
    return {
      title: 'AI画廊 - 发现无限创意可能',
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