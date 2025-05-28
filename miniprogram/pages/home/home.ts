const appInstance = getApp<IAppOption>()

Page({
  data: {
    artworks: [] as any[],
    loading: false,
    hasMore: true
  },

  onLoad() {
    this.loadArtworks()
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.refreshArtworks()
  },

  onPullDownRefresh() {
    this.refreshArtworks()
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMoreArtworks()
    }
  },

  // 加载作品列表
  loadArtworks() {
    this.setData({ loading: true })
    
    // 使用mock数据
    const mockArtworks = this.generateMockArtworks()
    
    setTimeout(() => {
      this.setData({
        artworks: mockArtworks,
        loading: false
      })
    }, 500)
  },

  // 刷新作品列表
  refreshArtworks() {
    this.setData({ 
      hasMore: true 
    })
    this.loadArtworks()
    wx.stopPullDownRefresh()
  },

  // 加载更多作品
  loadMoreArtworks() {
    if (this.data.loading) return
    
    this.setData({ loading: true })
    
    setTimeout(() => {
      const newArtworks = this.generateMockArtworks(6)
      
      this.setData({
        artworks: [...this.data.artworks, ...newArtworks],
        loading: false,
        hasMore: this.data.artworks.length < 24 // 最多24个作品
      })
    }, 1000)
  },

  // 生成mock数据
  generateMockArtworks(count: number = 12) {
    const prompts = [
      '梦幻森林中的小屋',
      '未来科技城市夜景',
      '古典美人肖像',
      '星空下的山峰',
      '机械朋克风格机器人',
      '樱花飞舞的庭院',
      '神秘的魔法城堡',
      '海底世界奇观',
      '蒸汽朋克飞艇',
      '童话风格小镇',
      '抽象艺术色彩',
      '赛博朋克街道'
    ]
    
    const authors = [
      '艺术家小明',
      '创作者小红',
      '画师小李',
      '设计师小王',
      '创意师小张',
      '美术师小刘'
    ]
    
    const artworks = []
    for (let i = 0; i < count; i++) {
      const randomId = Date.now() + i
      const randomHeight = 300 + Math.floor(Math.random() * 200)
      
      artworks.push({
        id: randomId,
        prompt: prompts[Math.floor(Math.random() * prompts.length)],
        imageUrl: `https://picsum.photos/300/${randomHeight}?random=${randomId}`,
        author: authors[Math.floor(Math.random() * authors.length)],
        avatar: `https://picsum.photos/60/60?random=${randomId + 1000}`,
        createTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        timeAgo: this.getTimeAgo(new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000))
      })
    }
    
    return artworks
  },

  // 计算时间差
  getTimeAgo(date: Date) {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (minutes < 60) {
      return `${minutes}分钟前`
    } else if (hours < 24) {
      return `${hours}小时前`
    } else {
      return `${days}天前`
    }
  },

  // 点击作品卡片
  onArtworkTap(e: any) {
    const artwork = e.currentTarget.dataset.artwork
    
    wx.showModal({
      title: '作品详情',
      content: `提示词：${artwork.prompt}\n\n作者：${artwork.author}\n创建时间：${artwork.timeAgo}`,
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 点击创建按钮
  onCreateTap() {
    // 检查登录状态
    if (!appInstance.globalData.isLoggedIn) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再创作',
        confirmText: '去登录',
        cancelText: '取消',
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

    // 跳转到创建页面
    wx.switchTab({
      url: '/pages/create/create'
    })
  }
}) 