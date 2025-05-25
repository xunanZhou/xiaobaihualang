/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
    isLoggedIn: boolean,
    artworks: any[],
    userArtworks: any[]
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
  checkLoginStatus(): void,
  initSampleData(): void,
  login(userInfo: any): void,
  logout(): void,
  addArtwork(artwork: any): void,
  getTimeAgo(createTime: string): string
}