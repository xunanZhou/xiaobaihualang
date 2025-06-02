// app.ts
App<IAppOption>({
  globalData: {
    userInfo: undefined,
    isLoggedIn: false,
    artworks: [], // 存储所有作品
    userArtworks: [], // 存储用户作品
  },

  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 🔥 Step 1: 初始化云开发环境
    this.initCloud()

    // 检查登录状态
    this.checkLoginStatus()

    // 初始化示例数据
    this.initSampleData()

    // 登录
    wx.login({ //??? where does wx come from? wx.login will return a code, which is a string?
      success: res => {
        console.log(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    })
  },

   /**
   * 🔥 新增方法：初始化云开发环境
   * 
   * 作用：连接到腾讯云，让小程序可以使用云函数和云数据库
   */
   initCloud() {
    // 检查是否支持云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      return
    }

    // 初始化云开发环境
    wx.cloud.init({
      env: 'cloud1-1gj4027297324556',  // 🚨 重要：替换为你的云环境ID
      traceUser: true      // 用于在控制台中查看调用日志
    })
    
    console.log('云开发环境初始化成功')
  },

  // 🔥 更新登录方法，支持云函数返回的用户数据
  login(userData: any) {
    console.log('用户登录，数据：', userData)
    
    this.globalData.userInfo = userData
    this.globalData.isLoggedIn = true
    
    // 保存到本地存储
    wx.setStorageSync('userInfo', userData)
    wx.setStorageSync('userId', userData.userId)  // 保存用户ID
    wx.setStorageSync('openid', userData.openid)  // 保存openid
  },


  // 检查登录状态
  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.globalData.userInfo = userInfo
      this.globalData.isLoggedIn = true
    }
  },

  // 用户登出
  logout() {
    this.globalData.userInfo = undefined
    this.globalData.isLoggedIn = false
    wx.removeStorageSync('userInfo')
  },

  // 添加作品
  addArtwork(artwork: any) {
    artwork.id = Date.now()
    artwork.createTime = new Date().toISOString()
    artwork.likes = 0
    artwork.author = this.globalData.userInfo?.nickName || '匿名用户'
    artwork.avatar = this.globalData.userInfo?.avatarUrl || ''
    
    this.globalData.artworks.unshift(artwork)
    this.globalData.userArtworks.unshift(artwork)
    
    // 保存到本地存储
    wx.setStorageSync('artworks', this.globalData.artworks)
    wx.setStorageSync('userArtworks', this.globalData.userArtworks)
  },

  // 初始化示例数据
  initSampleData() {
    const storedArtworks = wx.getStorageSync('artworks')
    if (storedArtworks && storedArtworks.length > 0) {
      this.globalData.artworks = storedArtworks
    } else {
      // 创建示例数据
      this.globalData.artworks = [
        {
          id: 1,
          prompt: '一只可爱的小猫咪在花园里玩耍，阳光明媚，动漫风格',
          imageUrl: 'https://picsum.photos/300/400?random=1',
          author: '小明',
          avatar: 'https://picsum.photos/50/50?random=1',
          likes: 23,
          createTime: '2024-01-15T10:30:00Z',
          styles: ['动漫']
        },
        {
          id: 2,
          prompt: '未来城市的夜景，霓虹灯闪烁，赛博朋克风格',
          imageUrl: 'https://picsum.photos/300/500?random=2',
          author: '艺术家小李',
          avatar: 'https://picsum.photos/50/50?random=2',
          likes: 45,
          createTime: '2024-01-15T08:20:00Z',
          styles: ['科幻']
        },
        {
          id: 3,
          prompt: '梦幻森林中的精灵，魔法光芒环绕，奇幻风格',
          imageUrl: 'https://picsum.photos/300/450?random=3',
          author: '梦想家',
          avatar: 'https://picsum.photos/50/50?random=3',
          likes: 31,
          createTime: '2024-01-14T16:45:00Z',
          styles: ['梦幻']
        },
        {
          id: 4,
          prompt: '古代武侠，剑客在山峰上练剑，水墨画风格',
          imageUrl: 'https://picsum.photos/300/480?random=4',
          author: '武侠迷',
          avatar: 'https://picsum.photos/50/50?random=4',
          likes: 18,
          createTime: '2024-01-14T14:20:00Z',
          styles: ['水墨画']
        },
        {
          id: 5,
          prompt: '宇宙中的星云，色彩绚烂，科幻写实风格',
          imageUrl: 'https://picsum.photos/300/520?random=5',
          author: '星空观察者',
          avatar: 'https://picsum.photos/50/50?random=5',
          likes: 67,
          createTime: '2024-01-13T20:10:00Z',
          styles: ['科幻', '写实']
        },
        {
          id: 6,
          prompt: '海底世界，珊瑚礁和热带鱼，清新自然风格',
          imageUrl: 'https://picsum.photos/300/380?random=6',
          author: '海洋爱好者',
          avatar: 'https://picsum.photos/50/50?random=6',
          likes: 29,
          createTime: '2024-01-12T11:30:00Z',
          styles: ['写实']
        }
      ]
      wx.setStorageSync('artworks', this.globalData.artworks)
    }

    const storedUserArtworks = wx.getStorageSync('userArtworks')
    if (storedUserArtworks) {
      this.globalData.userArtworks = storedUserArtworks
    }
  },

  // 获取时间差
  getTimeAgo(createTime: string): string {
    const now = new Date()
    const created = new Date(createTime)
    const diff = now.getTime() - created.getTime()
    
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (minutes < 60) {
      return `${minutes}分钟前`
    } else if (hours < 24) {
      return `${hours}小时前`
    } else if (days < 7) {
      return `${days}天前`
    } else {
      return `1周前`
    }
  }
})