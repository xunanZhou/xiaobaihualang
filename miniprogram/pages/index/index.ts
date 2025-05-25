// index.ts
// 获取应用实例
(function() {
  const appInstance = getApp<IAppOption>()

  interface Artwork {
    id: number
    prompt: string
    imageUrl: string
    author: string
    avatar: string
    likes: number
    createTime: string
    styles: string[]
  }

  interface IndexData {
    artworks: Artwork[]
    loading: boolean
    refreshing: boolean
  }

  Page({
    data: {
      artworks: [],
      loading: false,
      refreshing: false
    } as IndexData,

    onLoad() {
      this.loadArtworks()
    },

    onShow() {
      // 每次显示页面时刷新数据
      this.loadArtworks()
    },

    // 加载作品列表
    loadArtworks() {
      this.setData({
        loading: true
      })

      // 模拟网络请求延迟
      setTimeout(() => {
        this.setData({
          artworks: appInstance.globalData.artworks,
          loading: false
        })
      }, 500)
    },

    // 下拉刷新
    onPullDownRefresh() {
      this.setData({
        refreshing: true
      })

      setTimeout(() => {
        this.setData({
          artworks: appInstance.globalData.artworks,
          refreshing: false
        })
        wx.stopPullDownRefresh()
      }, 1000)
    },

    // 点赞作品
    onLikeArtwork(e: WechatMiniprogram.TouchEvent) {
      const { id } = e.currentTarget.dataset
      const artworks = this.data.artworks.map((artwork: Artwork) => {
        if (artwork.id === id) {
          return { ...artwork, likes: artwork.likes + 1 }
        }
        return artwork
      })

      this.setData({ artworks })

      // 更新全局数据
      appInstance.globalData.artworks = artworks
      wx.setStorageSync('artworks', artworks)

      // 显示点赞动画
      wx.showToast({
        title: '点赞成功',
        icon: 'success',
        duration: 1000
      })
    },

    // 查看作品详情
    onViewDetail(e: WechatMiniprogram.TouchEvent) {
      const { id } = e.currentTarget.dataset
      wx.navigateTo({
        url: `/pages/detail/detail?id=${id}`
      })
    },

    // 跳转到创作页面
    onCreateArtwork() {
      if (!appInstance.globalData.isLoggedIn) {
        wx.showModal({
          title: '提示',
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

      wx.navigateTo({
        url: '/pages/create/create'
      })
    },

    // 获取时间差显示
    getTimeAgo(createTime: string): string {
      return appInstance.getTimeAgo(createTime)
    }
  })
})() 