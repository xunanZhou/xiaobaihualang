(function() {
  const appInstance = getApp<IAppOption>()

  interface ArtStyle {
    id: string
    name: string
    emoji: string
    gradient: string
  }

  interface SizeOption {
    label: string
    value: string
    ratio: string
  }

  interface QualityOption {
    label: string
    value: string
  }

  interface ExamplePrompt {
    id: number
    title: string
    prompt: string
    emoji: string
  }

  interface CreateData {
    prompt: string
    negativePrompt: string
    maxLength: number
    artStyles: ArtStyle[]
    selectedStyles: string[]
    showAdvanced: boolean
    selectedSize: string
    selectedQuality: string
    sizeOptions: SizeOption[]
    qualityOptions: QualityOption[]
    isGenerating: boolean
    progress: number
    progressText: string
    generatedImages: string[]
    selectedImageIndex: number
    examplePrompts: ExamplePrompt[]
    showHelpDialog: boolean
    helpContent: string
    statusBarHeight?: number
  }

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
    } as CreateData,

    onLoad(options: any) {
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
    onPromptChange(e: WechatMiniprogram.Input) {
      this.setData({
        prompt: e.detail.value
      })
    },

    onNegativePromptChange(e: WechatMiniprogram.Input) {
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

    // 老风格选择 - 修复选择逻辑
    // onStyleTap(e: WechatMiniprogram.TouchEvent) {
    //   const style = e.currentTarget.dataset.style
    //   const currentSelected = [...this.data.selectedStyles]
      
    //   console.log('Style tapped:', style.id, 'Current selected:', currentSelected)
      
    //   const index = currentSelected.indexOf(style.id)
    //   if (index > -1) {
    //     // 如果已选中，则取消选择
    //     currentSelected.splice(index, 1)
    //     this.setData({ selectedStyles: currentSelected })
    //     console.log('Style deselected, new selection:', currentSelected)
    //   } else {
    //     // 如果未选中，则设为唯一选择（单选模式）
    //     this.setData({ selectedStyles: [style.id] })
    //     console.log('Style selected, new selection:', [style.id])
    //   }
    // },

      // 超简单的测试方法
      onSimpleStyleTap(e: WechatMiniprogram.TouchEvent) {
        console.log('=== 简单测试开始 ===')
        
        const styleId = e.currentTarget.dataset.id
        console.log('点击ID:', styleId)
        console.log('当前选中:', this.data.selectedStyles)
        
        let newSelected: string[] = []
        if (this.data.selectedStyles.includes(styleId)) {
          newSelected = []  // 取消选择
        } else {
          newSelected = [styleId]  // 选择
        }
        
        console.log('新选中:', newSelected)
        
        this.setData({
          selectedStyles: newSelected
        }, () => {
          console.log('更新后:', this.data.selectedStyles)
        })
    },


      // 风格选择 - 完全重新实现
      onStyleTap(e: WechatMiniprogram.TouchEvent) {
        console.log('=== 风格点击事件开始 ===')
        
        // 获取点击的风格ID
        const dataset = e.currentTarget.dataset
        const styleId = dataset.style?.id //what's style?
        
        console.log('1. 点击的风格对象:', dataset.style)
        console.log('2. 风格ID:', styleId, '类型:', typeof styleId)
        console.log('3. 当前选中数组:', this.data.selectedStyles, '类型:', typeof this.data.selectedStyles)
        
              // 检查数组中每个元素的类型
        // this.data.selectedStyles.forEach((id, index) => { //this selected styles a global variable, why I have to use this.data？
        //   console.log(`4. 数组[${index}]:`, id, '类型:', typeof id)
        // })
      
        const isSelected = this.data.selectedStyles.includes(styleId)
        console.log('5. selected结果:', isSelected)


        if (!styleId) {
          console.error('没有获取到风格ID')
          return
        }
        
        // 获取当前选中的风格数组
        let newSelectedStyles = [...this.data.selectedStyles]
        
        
        if (isSelected) {
          // 如果已选中，则取消选择
          newSelectedStyles = newSelectedStyles.filter(id => id !== styleId)
          console.log('取消选择，新数组:', newSelectedStyles)
        } else {
          // 如果未选中，则设为唯一选择（单选模式）
          newSelectedStyles = [styleId]
          console.log('选择新风格，新数组:', newSelectedStyles)
        }
        
        // 更新数据
        this.setData({
          selectedStyles: newSelectedStyles
        }, () => {
          console.log('数据更新完成，当前选中:', this.data.selectedStyles)
          console.log('=== 风格点击事件结束 ===')
        })
      },

    // 高级设置
    onToggleAdvanced() {
      this.setData({
        showAdvanced: !this.data.showAdvanced
      })
    },

    onSizeSelect(e: WechatMiniprogram.TouchEvent) {
      const { value } = e.currentTarget.dataset
      this.setData({ selectedSize: value })
    },

    onQualitySelect(e: WechatMiniprogram.TouchEvent) {
      const { value } = e.currentTarget.dataset
      this.setData({ selectedQuality: value })
    },

    // 示例提示词
    onExampleTap(e: WechatMiniprogram.TouchEvent) {
      const { prompt } = e.currentTarget.dataset
      this.setData({ prompt })
    },

    // 生成图片 - 完全替换原有方法
    async onGenerateTap() {
      // 验证输入
      if (!this.data.prompt.trim()) {
        this.showToast('请输入描述内容', 'warning')
        return
      }

      if (this.data.selectedStyles.length === 0) {
        this.showToast('请选择一种艺术风格', 'warning')
        return
      }

      // 检查登录状态
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

      await this.startRealGeneration()
    },

    // 开始真实生成 - 新增方法
    async startRealGeneration() {
      this.setData({
        isGenerating: true,
        progress: 10,
        progressText: '正在创建任务...',
        generatedImages: []
      })

      try {
        wx.showLoading({
          title: '创建任务中...',
          mask: true
        })

        // 调用云函数创建任务
        const createResult = await wx.cloud.callFunction({
          name: 'imageGeneration',
          data: {
            name: 'createTask',
            prompt: this.data.prompt.trim(),
            style: this.data.selectedStyles[0] // 取第一个选中的风格
          }
        })

        wx.hideLoading()

        console.log('Create task result:', createResult)

        if (!createResult.result || !createResult.result.success) {
          const error = createResult.result?.error || '创建任务失败'
          throw new Error(error)
        }

        const { taskId } = createResult.result.data
        
        this.setData({
          progress: 30,
          progressText: '任务已创建，正在生成中...'
        })

        // 开始轮询查询结果
        this.pollTaskResult(taskId)

      } catch (error: any) {
        wx.hideLoading()
        console.error('Create task error:', error)
        this.setData({
          isGenerating: false,
          progress: 0,
          progressText: '准备中...'
        })
        this.showToast(`创建失败: ${error.message}`, 'error')
      }
    },

    // 轮询任务结果 - 新增方法
    async pollTaskResult(taskId: string) {
      let pollCount = 0
      const maxPolls = 100 // 最大轮询次数 (约5分钟)
      const pollInterval = 3000 // 轮询间隔3秒

      console.log('🚀 开始轮询任务:', taskId)


      const poll = async () => {
        try {
          pollCount++
          
          // 更新进度显示
          const progress = Math.min(30 + (pollCount * 2), 90) 
          const timeSpent = pollCount * 3
          this.setData({
            progress: progress,
            progressText: `AI正在创作中... (${timeSpent}秒)`
          })

          console.log(`🔄 轮询尝试 ${pollCount}/${maxPolls}, 任务ID: ${taskId}`)

          const queryResult = await wx.cloud.callFunction({
            name: 'imageGeneration',
            data: {
              name: 'queryTask',
              taskId: taskId
            }
          })

          console.log('📡 云函数返回原始结果:', queryResult)
          console.log('📡 云函数结果详情:', JSON.stringify(queryResult.result, null, 2))

          if (!queryResult.result || !queryResult.result.success) {
            const error = queryResult.result?.error || '查询任务失败'
            console.error('❌ 查询失败:', error)
            throw new Error(error)
          }

         // 🎯 优雅的数据提取
         const responseData = queryResult.result.data
      
         // 基础状态
         const status = responseData.status
         
         // 图片相关 - 优先使用 uploadResult 中的 fileID
         const imageUrl = responseData.uploadResult?.fileID || null
         
         // 保存状态 - 有 uploadResult 且成功就认为已保存
         const saved = !!(responseData.uploadResult?.fileID && responseData.uploadResult?.errMsg === 'uploadFile:ok')
         
         // 实际提示词 - 从嵌套结构中提取
         const actualPrompt = responseData.taskData?.results?.[0]?.actual_prompt || 
                             responseData.actualPrompt || 
                             null
   
         // 🔍 调试日志
         console.log('📊 提取的数据:')
         console.log(`  状态: ${status}`)
         console.log(`  图片URL: ${imageUrl}`)
         console.log(`  已保存: ${saved}`)
         console.log(`  实际提示词: ${actualPrompt?.substring(0, 50)}...`)

          if (status === 'SUCCEEDED') {
            // 生成成功
            this.setData({
              isGenerating: false,
              progress: 100,
              progressText: '生成完成！',
              generatedImages: [imageUrl],
              selectedImageIndex: 0
            })
            
            const message = saved ? '生成成功！已保存到个人相册' : '生成成功！'
            this.showToast(message, 'success')
            
            // 如果有实际使用的提示词，也可以显示给用户
            if (actualPrompt && actualPrompt !== this.data.prompt) {
              console.log('Actual prompt used:', actualPrompt)
            }
            return
          }

          if (status === 'FAILED') {
            throw new Error('图片生成失败，请检查提示词后重试')
          }

          if (status === 'CANCELED') {
            throw new Error('任务已取消')
          }

          // 检查是否超时
          if (pollCount >= maxPolls) {
            this.setData({
              isGenerating: false,
              progress: 0,
              progressText: '准备中...'
            })
            
            wx.showModal({
              title: '生成时间较长',
              content: '图片生成需要更多时间，完成后会自动保存到您的个人相册中。您可以稍后在个人主页查看。',
              showCancel: false,
              confirmText: '我知道了'
            })
            return
          }

          // 继续轮询
          if (status === 'PENDING' || status === 'RUNNING') {
            setTimeout(poll, pollInterval)
          } else {
            // 未知状态
            console.warn('Unknown task status:', status)
            setTimeout(poll, pollInterval)
          }

        } catch (error: any) {
          console.error('Poll task error:', error)
          this.setData({
            isGenerating: false,
            progress: 0,
            progressText: '准备中...'
          })
          this.showToast(`查询失败: ${error.message}`, 'error')
        }
      }

      // 开始轮询
      setTimeout(poll, pollInterval)
    },

    // 重新生成 - 修改原有方法
    onRegenerateTap() {
      wx.showModal({
        title: '重新生成',
        content: '确定要重新生成图片吗？这将消耗一次生成额度。',
        success: (res) => {
          if (res.confirm) {
            this.startRealGeneration()
          }
        }
      })
    },

    // 选择图片
    onImageSelect(e: WechatMiniprogram.TouchEvent) {
      const { index } = e.currentTarget.dataset
      this.setData({ selectedImageIndex: index })
    },

    // 发布作品
    onPublishTap() {
      if (this.data.generatedImages.length === 0) {
        this.showToast('请先生成图片', 'warning')
        return
      }

      const selectedImage = this.data.generatedImages[this.data.selectedImageIndex]
      this.saveArtwork(selectedImage)
    },

    // 保存作品
    saveArtwork(imageUrl: string) {
      const artwork = {
        prompt: this.data.prompt,
        negativePrompt: this.data.negativePrompt,
        imageUrl: imageUrl,
        styles: this.data.selectedStyles,
        size: this.data.selectedSize,
        quality: this.data.selectedQuality
      }

      // 添加到全局数据
      appInstance.addArtwork(artwork)

      // 更新用户统计
      this.updateUserStats()

      this.showToast('发布成功！', 'success')

      // 跳转到成功页面
      setTimeout(() => {
        wx.navigateTo({
          url: `/pages/create-success/create-success?artworkData=${encodeURIComponent(JSON.stringify(artwork))}`
        })
      }, 1500)
    },

    // 更新用户统计
    updateUserStats() {
      // 这里可以更新用户的创作统计数据
      console.log('更新用户统计数据')
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

    // 分享功能
    onShareAppMessage() {
      return {
        title: 'AI画廊 - 用文字创作艺术',
        path: '/pages/create/create',
        imageUrl: '/assets/images/share-cover.jpg'
      }
    },

    onShareTimeline() {
      return {
        title: 'AI画廊 - 释放你的创意',
        imageUrl: '/assets/images/share-cover.jpg'
      }
    }
  })
})() 