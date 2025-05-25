// pages/test/test.ts
(function() {
  const appInstance = getApp<IAppOption>()

  interface SystemInfo {
    model: string
    system: string
    version: string
    screenWidth: number
    screenHeight: number
  }

  interface TestData {
    systemInfo: SystemInfo
    isLoggedIn: boolean
    networkType: string
    currentTime: string
    showDialog: boolean
  }

  Page({
    data: {
      systemInfo: {
        model: '',
        system: '',
        version: '',
        screenWidth: 0,
        screenHeight: 0
      },
      isLoggedIn: false,
      networkType: 'unknown',
      currentTime: '',
      showDialog: false
    } as TestData,

    onLoad() {
      console.log('测试页面加载')
      this.initSystemInfo()
      this.initNetworkInfo()
      this.updateTime()
      this.checkLoginStatus()
    },

    onShow() {
      console.log('测试页面显示')
      this.updateTime()
      this.checkLoginStatus()
    },

    // 初始化系统信息
    initSystemInfo() {
      try {
        const systemInfo = wx.getSystemInfoSync()
        this.setData({
          systemInfo: {
            model: systemInfo.model,
            system: systemInfo.system,
            version: systemInfo.version,
            screenWidth: systemInfo.screenWidth,
            screenHeight: systemInfo.screenHeight
          }
        })
        console.log('系统信息获取成功:', systemInfo)
      } catch (error) {
        console.error('获取系统信息失败:', error)
        this.showToast('获取系统信息失败', 'error')
      }
    },

    // 初始化网络信息
    initNetworkInfo() {
      wx.getNetworkType({
        success: (res) => {
          this.setData({
            networkType: res.networkType
          })
          console.log('网络类型:', res.networkType)
        },
        fail: (error) => {
          console.error('获取网络信息失败:', error)
          this.setData({
            networkType: '获取失败'
          })
        }
      })
    },

    // 更新当前时间
    updateTime() {
      const now = new Date()
      const timeString = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
      this.setData({
        currentTime: timeString
      })
    },

    // 检查登录状态
    checkLoginStatus() {
      const isLoggedIn = appInstance.globalData.isLoggedIn || false
      this.setData({
        isLoggedIn: isLoggedIn
      })
    },

    // 页面导航
    navigateToHome() {
      wx.navigateTo({
        url: '/pages/home/home',
        success: () => {
          console.log('导航到首页成功')
          this.showToast('导航到首页', 'success')
        },
        fail: (error) => {
          console.error('导航到首页失败:', error)
          this.showToast('导航失败', 'error')
        }
      })
    },

    navigateToCreate() {
      wx.navigateTo({
        url: '/pages/create/create',
        success: () => {
          console.log('导航到创作页面成功')
          this.showToast('导航到创作页面', 'success')
        },
        fail: (error) => {
          console.error('导航到创作页面失败:', error)
          this.showToast('导航失败', 'error')
        }
      })
    },

    navigateToProfile() {
      wx.navigateTo({
        url: '/pages/profile/profile',
        success: () => {
          console.log('导航到个人中心成功')
          this.showToast('导航到个人中心', 'success')
        },
        fail: (error) => {
          console.error('导航到个人中心失败:', error)
          this.showToast('导航失败', 'error')
        }
      })
    },

    // 功能测试
    testToast() {
      this.showToast('这是一个测试Toast消息', 'success')
      console.log('Toast测试执行')
    },

    testDialog() {
      this.setData({
        showDialog: true
      })
      console.log('Dialog测试执行')
    },

    testStorage() {
      const testData = {
        timestamp: Date.now(),
        message: '这是测试数据',
        version: '1.0.0'
      }

      try {
        // 测试同步存储
        wx.setStorageSync('test_data', testData)
        const retrievedData = wx.getStorageSync('test_data')
        
        if (retrievedData && retrievedData.message === testData.message) {
          this.showToast('存储测试成功', 'success')
          console.log('存储测试成功:', retrievedData)
        } else {
          this.showToast('存储测试失败', 'error')
          console.error('存储测试失败: 数据不匹配')
        }
      } catch (error) {
        this.showToast('存储测试失败', 'error')
        console.error('存储测试失败:', error)
      }
    },

    // Dialog事件处理
    onDialogConfirm() {
      this.setData({
        showDialog: false
      })
      this.showToast('Dialog确认', 'success')
      console.log('Dialog确认')
    },

    onDialogCancel() {
      this.setData({
        showDialog: false
      })
      this.showToast('Dialog取消', 'info')
      console.log('Dialog取消')
    },

    // 显示Toast消息
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

    // 页面生命周期
    onReady() {
      console.log('测试页面初次渲染完成')
    },

    onHide() {
      console.log('测试页面隐藏')
    },

    onUnload() {
      console.log('测试页面卸载')
    },

    // 页面事件处理
    onPullDownRefresh() {
      console.log('下拉刷新')
      this.updateTime()
      this.checkLoginStatus()
      this.initNetworkInfo()
      
      setTimeout(() => {
        wx.stopPullDownRefresh()
        this.showToast('刷新完成', 'success')
      }, 1000)
    },

    onReachBottom() {
      console.log('上拉触底')
      this.showToast('已到达页面底部', 'info')
    },

    // 页面滚动
    onPageScroll(e: any) {
      // 可以在这里处理页面滚动事件
      // console.log('页面滚动:', e.scrollTop)
    },

    // 页面分享
    onShareAppMessage(): WechatMiniprogram.Page.ICustomShareContent {
      return {
        title: 'AI画廊小程序 - 测试页面',
        path: '/pages/test/test',
        imageUrl: '/assets/images/share-cover.jpg'
      }
    },

    onShareTimeline(): WechatMiniprogram.Page.ICustomTimelineContent {
      return {
        title: 'AI画廊小程序测试',
        imageUrl: '/assets/images/share-cover.jpg'
      }
    }
  })
})() 