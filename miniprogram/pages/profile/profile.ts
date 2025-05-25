(function() {
  const appInstance = getApp<IAppOption>()

  interface UserInfo {
    nickName: string
    avatarUrl: string
  }

  interface UserStats {
    artworks: number
    likes: number
    days: number
  }

  interface Achievement {
    name: string
    theme: string
  }

  interface QuickAction {
    id: string
    label: string
    icon: string
    iconColor: string
    bgColor: string
  }

  interface UserArtwork {
    id: number
    prompt: string
    imageUrl: string
    likes: number
    timeAgo: string
    createdAt: string
  }

  interface Feature {
    id: number
    title: string
    desc: string
    icon: string
    bgColor: string
  }

  interface PreviewArtwork {
    id: number
    title: string
    color: string
  }

  interface Inspiration {
    id: number
    title: string
    desc: string
    emoji: string
  }

  interface ProfileData {
    isLoggedIn: boolean
    showLoginDialog: boolean
    userInfo: UserInfo
    userStats: UserStats
    achievements: Achievement[]
    quickActions: QuickAction[]
    userArtworks: UserArtwork[]
    features: Feature[]
    previewArtworks: PreviewArtwork[]
    inspirations: Inspiration[]
    statusBarHeight?: number
  }

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
    } as ProfileData,

    onLoad(options: any) {
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
      const isLoggedIn = appInstance.globalData.isLoggedIn
      const userInfo = appInstance.globalData.userInfo
      
      if (isLoggedIn && userInfo) {
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
      this.loadUserArtworks()
      this.loadUserStats()
    },

    // 加载用户作品
    loadUserArtworks() {
      const userArtworks = appInstance.globalData.userArtworks || []
      const artworksWithTimeAgo = userArtworks.map((artwork: any) => ({
        ...artwork,
        timeAgo: appInstance.getTimeAgo(artwork.createTime)
      }))
      
      this.setData({
        userArtworks: artworksWithTimeAgo
      })
    },

    // 加载用户统计
    loadUserStats() {
      const userArtworks = appInstance.globalData.userArtworks || []
      const totalLikes = userArtworks.reduce((sum: number, artwork: any) => sum + (artwork.likes || 0), 0)
      
      this.setData({
        userStats: {
          artworks: userArtworks.length,
          likes: totalLikes,
          days: 7 // 简化计算
        }
      })
    },

    // 刷新用户数据
    refreshUserData() {
      this.loadUserData()
      wx.stopPullDownRefresh()
    },

    // 登录按钮
    onLoginTap() {
      this.setData({ showLoginDialog: true })
    },

    // 确认登录
    onConfirmLogin() {
      this.setData({ showLoginDialog: false })
      this.performLogin()
    },

    // 取消登录
    onCancelLogin() {
      this.setData({ showLoginDialog: false })
    },

    // 执行登录
    performLogin() {
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: (res) => {
          const userInfo = res.userInfo
          
          // 保存用户信息到全局状态
          appInstance.login(userInfo)
          
          this.setData({
            isLoggedIn: true,
            userInfo: userInfo
          })
          
          this.loadUserData()
          this.showToast('登录成功', 'success')
        },
        fail: () => {
          this.showToast('登录失败，请重试', 'error')
        }
      })
    },

    // 设置按钮
    onSettingsTap() {
      wx.showActionSheet({
        itemList: ['退出登录'],
        success: (res) => {
          if (res.tapIndex === 0) {
            this.logout()
          }
        }
      })
    },

    // 退出登录
    logout() {
      wx.showModal({
        title: '确认退出',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            appInstance.logout()
            this.setData({
              isLoggedIn: false,
              userInfo: {
                nickName: '',
                avatarUrl: '/images/avatar-default.png'
              }
            })
            this.showToast('已退出登录', 'success')
          }
        }
      })
    },

    // 功能卡片点击
    onFeatureTap(e: WechatMiniprogram.TouchEvent) {
      const { feature } = e.currentTarget.dataset
      
      wx.showModal({
        title: feature.title,
        content: `${feature.desc}\n\n请先登录体验完整功能`,
        confirmText: '立即登录',
        success: (res) => {
          if (res.confirm) {
            this.onLoginTap()
          }
        }
      })
    },

    // 预览作品点击
    onPreviewTap() {
      wx.showModal({
        title: '查看更多',
        content: '登录后可查看完整作品库',
        confirmText: '立即登录',
        success: (res) => {
          if (res.confirm) {
            this.onLoginTap()
          }
        }
      })
    },

    // 快捷操作点击
    onActionTap(e: WechatMiniprogram.TouchEvent) {
      const { action } = e.currentTarget.dataset
      
      switch (action.id) {
        case 'create':
          wx.navigateTo({
            url: '/pages/create/create'
          })
          break
        case 'collection':
          this.showToast('收藏功能开发中', 'info')
          break
        case 'stats':
          this.showToast('统计功能开发中', 'info')
          break
        case 'settings':
          this.onSettingsTap()
          break
        default:
          this.showToast('功能开发中', 'info')
      }
    },

    // 作品点击
    onArtworkTap(e: WechatMiniprogram.TouchEvent) {
      const { artwork } = e.currentTarget.dataset
      
      wx.showModal({
        title: '作品详情',
        content: `提示词：${artwork.prompt}\n\n获赞：${artwork.likes}\n创建时间：${artwork.timeAgo}`,
        showCancel: false,
        confirmText: '知道了'
      })
    },

    // 查看全部作品
    onViewAllTap() {
      this.showToast('作品管理功能开发中', 'info')
    },

    // 创作按钮
    onCreateTap() {
      wx.navigateTo({
        url: '/pages/create/create'
      })
    },

    // 显示提示信息
    showToast(message: string, type: string = 'info') {
      const iconMap: { [key: string]: any } = {
        success: 'success',
        error: 'error',
        warning: 'none',
        info: 'none'
      }
      
      wx.showToast({
        title: message,
        icon: iconMap[type] || 'none',
        duration: 2000
      })
    },

    // 下拉刷新
    onPullDownRefresh() {
      if (this.data.isLoggedIn) {
        this.refreshUserData()
      } else {
        wx.stopPullDownRefresh()
      }
    },

    // 分享功能
    onShareAppMessage() {
      return {
        title: 'AI画廊 - 发现无限创意可能',
        path: '/pages/home/home',
        imageUrl: '/assets/images/share-cover.jpg'
      }
    },

    onShareTimeline() {
      return {
        title: 'AI画廊 - 用文字创作艺术',
        imageUrl: '/assets/images/share-cover.jpg'
      }
    }
  })
})() 