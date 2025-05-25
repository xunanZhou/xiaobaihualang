(function() {
  const appInstance = getApp<IAppOption>()

  Page({
    data: {
      artworks: [] as any[],
      loading: false,
      hasMore: true,
      page: 1,
      pageSize: 10
    },

    onLoad() {
      this.loadArtworks()
    },

    onShow() {
      // 每次显示页面时刷新数据，以便显示新发布的作品
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
      
      // 模拟网络请求延迟
      setTimeout(() => {
        const allArtworks = appInstance.globalData.artworks || []
        const artworksWithTimeAgo = allArtworks.map(artwork => ({
          ...artwork,
          timeAgo: appInstance.getTimeAgo(artwork.createTime)
        }))
        
        this.setData({
          artworks: artworksWithTimeAgo,
          loading: false
        })
      }, 500)
    },

    // 刷新作品列表
    refreshArtworks() {
      this.setData({ 
        page: 1,
        hasMore: true 
      })
      this.loadArtworks()
      wx.stopPullDownRefresh()
    },

    // 加载更多作品
    loadMoreArtworks() {
      if (this.data.loading) return
      
      this.setData({ loading: true })
      
      // 模拟加载更多数据
      setTimeout(() => {
        const currentArtworks = this.data.artworks
        const newPage = this.data.page + 1
        
        // 模拟没有更多数据的情况
        if (newPage > 3) {
          this.setData({
            loading: false,
            hasMore: false
          })
          wx.showToast({
            title: '没有更多作品了',
            icon: 'none',
            duration: 2000
          })
          return
        }
        
        // 生成更多示例数据
        const moreArtworks = this.generateMoreArtworks(newPage)
        
        this.setData({
          artworks: [...currentArtworks, ...moreArtworks],
          loading: false,
          page: newPage
        })
      }, 1000)
    },

    // 生成更多示例数据
    generateMoreArtworks(page: number) {
      const styles = ['写实', '动漫', '科幻', '梦幻', '水墨画', '油画', '简约', '复古']
      const subjects = [
        '可爱的小动物',
        '未来科技城市',
        '古代建筑',
        '自然风景',
        '抽象艺术',
        '人物肖像',
        '静物画',
        '太空场景'
      ]
      
      const moreArtworks = []
      for (let i = 0; i < 6; i++) {
        const randomStyle = styles[Math.floor(Math.random() * styles.length)]
        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)]
        const randomId = Date.now() + i + page * 1000
        
        moreArtworks.push({
          id: randomId,
          prompt: `${randomSubject}，${randomStyle}风格，高清细节`,
          imageUrl: `https://picsum.photos/300/${300 + Math.floor(Math.random() * 200)}?random=${randomId}`,
          author: `用户${Math.floor(Math.random() * 1000)}`,
          avatar: `https://picsum.photos/50/50?random=${randomId}`,
          likes: Math.floor(Math.random() * 100),
          createTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          styles: [randomStyle],
          timeAgo: appInstance.getTimeAgo(new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString())
        })
      }
      
      return moreArtworks
    },

    // 点击作品卡片
    onArtworkTap(e: any) {
      const artwork = e.currentTarget.dataset.artwork
      
      // 显示作品详情
      wx.showModal({
        title: '作品详情',
        content: `提示词：${artwork.prompt}\n\n作者：${artwork.author}\n获赞：${artwork.likes}\n创建时间：${artwork.timeAgo}`,
        showCancel: false,
        confirmText: '知道了'
      })
    },

    // 点击搜索
    onSearchTap() {
      wx.showToast({
        title: '搜索功能开发中',
        icon: 'none',
        duration: 2000
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
      wx.navigateTo({
        url: '/pages/create/create'
      })
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