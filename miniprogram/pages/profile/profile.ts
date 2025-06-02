(function() { //??? usage of function() {}
  const appInstance = getApp<IAppOption>() //??? what's the usage of getApp<IAppOption>()?

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

  interface ProfileData { //?? What's the usage of interface?
    isLoggedIn: boolean 
    showLoginDialog: boolean //??? what's the usage of var_name : boolean? is it the definition of the var?
    /* ??? t-dialog's usage? it's an element with a property visible="{{showLoginDialog}}", controlled by the state managed in the ProfileData interface, similar usage like state in React?
        <!-- 登录弹窗 -->
        <t-dialog 
        visible="{{showLoginDialog}}"
        title="微信登录"
        content="是否使用微信账号登录AI画廊？"
        confirm-btn="确认登录"
        cancel-btn="取消"
        bind:confirm="onConfirmLogin"
        bind:cancel="onCancelLogin"
        /> 
    */    
    
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
      //??looks like set showLoginDialog to true will automatically trigger the login dialog interface?
      //??
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
        console.log("performLogin is called")
        //step 1: 微信登录凭证
        wx.getUserProfile({ //
            desc: '完善用户资料',
            success: (profileRes) => {
                // console.log("after calling wx.login()", profileRes) //why I cannot extend loginRes? like ...loginres? 
                //? wx.login() is a function of wx, which is the global 
                // object of wechat mini program, and wx is defined in the miniprogram/app.ts
                // console.log("profileRes.userinfo: ", profileRes.userInfo)
                if (profileRes.userInfo) {
                    //step 2: 获取用户信息
                    wx.login({
                        desc: '完善用户资料',
                        success: (loginRes) => {
                            console.log("get profileres successfully", loginRes)
                            
                            // 🔥 获取设备信息
                            const systemInfo = wx.getSystemInfoSync()
                            
                            const deviceInfo = {
                              platform: systemInfo.platform,        // "ios" | "android" | "windows" | "mac"
                              version: systemInfo.version,          // 微信版本号
                              system: systemInfo.system,            // 操作系统版本
                              model: systemInfo.model,              // 设备型号
                              brand: systemInfo.brand,              // 设备品牌
                              SDKVersion: systemInfo.SDKVersion,    // 基础库版本
                              pixelRatio: systemInfo.pixelRatio,    // 设备像素比
                              screenWidth: systemInfo.screenWidth,  // 屏幕宽度
                              screenHeight: systemInfo.screenHeight, // 屏幕高度
                              language: systemInfo.language,        // 微信设置的语言
                              fontSizeSetting: systemInfo.fontSizeSetting // 用户字体大小设置
                            }
                            
                            console.log("📱 设备信息:", deviceInfo)

                            this.callLoginCloudFunction(loginRes.code, profileRes.userInfo, deviceInfo) 

                        },
                        fail: (loginRes) => {
                          console.error("❌ 获取用户信息失败！", loginRes)
                          if (loginRes.errMsg && loginRes.errMsg.includes('deny')) {
                            // 用户拒绝授权
                            wx.showModal({
                              title: '授权提示',
                              content: '需要获取您的基本信息才能正常使用登录功能，请允许授权',
                              confirmText: '重新授权',
                              cancelText: '暂不登录',
                              success: (modalRes) => {
                                if (modalRes.confirm) {
                                  // 用户选择重新授权，递归调用登录
                                  this.performLogin()
                                } else {
                                  // 用户选择不登录
                                  this.showToast('已取消登录', 'info')
                                }
                              }
                            })
                          } else {
                            // 其他错误
                            this.showToast('获取用户信息失败，请重试', 'error')
                          }
                        }
                    })
                }
            }
        })
    },

  callLoginCloudFunction(code: string, userInfo: any, deviceInfo: any) {
      console.log("callLoginCloudFunction is called")
      console.log("code: ", code)
      console.log("userInfo: ", userInfo)

      // 显示登录加载提示
      wx.showLoading({
        title: '登录中...',
        mask: true
      })

      // 💡 wx.cloud.callFunction() 是微信小程序云开发提供的API
      // 用于调用云函数，这里调用名为'userLogin'的云函数
      wx.cloud.callFunction({
        name: 'userLogin',  // 🎯 云函数名称，必须与cloudfunctions目录下的文件夹名一致
        data: {             // 📤 传递给云函数的数据
          code: code,       // 微信登录凭证，用于在服务端获取openid
          userInfo: userInfo, // 用户基本信息(昵称、头像等)
          deviceInfo: deviceInfo
        },
        success: (res: any) => {
          console.log("callLoginCloudFunction success", res)
          wx.hideLoading() //需要隐藏loading吗?
          console.log("获得云函数返回结果", res)
          if (res.result.success) {
            // ✅ 登录成功处理
            console.log("✅ 登录成功！")
            const userData = res.result.data

            //保存数据到全局
            const app = getApp<IAppOption>() //保存数据到全局是什么用法?
            app.login(userData)

            //更新页面状态
            this.setData({
              isLoggedIn: true,
              userInfo: userData,
              showLoginDialog: false
            })

            this.loadUserData()
            this.showToast('登录成功', 'success')
          } else {
            //❌ 登录失败处理
            console.error("❌ 登录失败！")
            this.showToast('登录失败，请重试', 'error')
          }
        },
        fail: (err: any) => {
          wx.hideLoading() //需要隐藏loading吗?
          console.error("❌ 云函数调用失败！", err)
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