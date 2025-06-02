/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
    isLoggedIn: boolean,
    artworks: any[],
    userArtworks: any[]
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,

  initSampleData(): void,

  addArtwork(artwork: any): void,
  getTimeAgo(createTime: string): string,

  // 🔥 云开发相关方法
  initCloud(): void,

  // 用户相关方法  
  checkLoginStatus(): void,
  login(userInfo: any): void,
  logout(): void,
}