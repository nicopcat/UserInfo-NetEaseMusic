/*获取用户详情
				说明: 登录后调用此接口, 传入用户 id, 可以获取用户详情
				 必选参数: uid: 用户 id
				接口地址: /user/detail
				调用例子: /user/detail ? uid = 32953014
				*/

// 获取用户播放记录
//     说明: 登录后调用此接口, 传入用户 id, 可获取用户播放记录
//     必选参数: uid: 用户 id
//     可选参数: type: type = 1 时只返回 weekData, type = 0 时返回 allData
//     接口地址: /user/record
//     调用例子: /user/record ? uid = 98975481 & type=1
//725030

//获取歌单详情
// 说明: 歌单能看到歌单名字, 但看不到具体歌单内容, 调用此接口, 传入歌单 id, 可 以获取对应歌单内的所有的音乐(未登录状态只能获取不完整的歌单, 登录后是完整的)，但是返回的trackIds是完整的，tracks 则是不完整的，可拿全部 trackIds 请求一次 song / detail 接口获取所有歌曲的详情(https://github.com/Binaryify/NeteaseCloudMusicApi/issues/452)
// 必选参数 : id : 歌单 id
// 可选参数 : s : 歌单最近的 s 个收藏者, 默认为8
// 接口地址 : /playlist/detail
// 调用例子 : /playlist/detail ? id = 24381616


window.onload = function () {
	var app = new Vue({
		el: "#app",
		data: {
			userID: "",
			userInfo: {
				signature: "",
				listenSongs: "",
				profile: {
					avatarUrl: "imgs/user-icon-256.png",
					nickname: "",
					signature: ""
				}
			},
			userRecordWeek: {
				// name: [],
				// artists: [],
			},
			playlists: {
				name: [],
				coverImgUrl: [],
				playlistId: [],
			},
			isInfoShow: false
		},
		methods: {
			getUserInfo: function (userID) {
				this.isInfoShow = true;
				var that = this;
				axios.get("https://autumnfish.cn/user/detail?uid=" + userID).then(function (response) {
					that.userInfo.profile.avatarUrl = response.data.profile.avatarUrl;
					that.userInfo.profile.nickname = response.data.profile.nickname;
					that.userInfo.profile.signature = response.data.profile.signature;
					that.userInfo.listenSongs = response.data.listenSongs;
				}, function (err) { });


				axios.get("https://autumnfish.cn/user/record?uid=" + userID + "&type=0").then(function (response) {
					for (i = 0; i < 10; i++) {
						Vue.set(that.userRecordWeek, response.data.allData[i].song.name, response.data.allData[i].song.ar[0].name);
					}
				}, function (err) { });

				axios.get("https://autumnfish.cn/user/playlist?uid=" + userID + "&limit=40").then(function (response) {
					for (i = 0; i < 10; i++) {
						that.playlists.name.push(response.data.playlist[i].name);
						that.playlists.coverImgUrl.push(response.data.playlist[i].coverImgUrl);
						that.playlists.playlistId.push(response.data.playlist[i].id);

					}
				}, function (err) { });

				this.userID = "";
			}
		}
	})
};