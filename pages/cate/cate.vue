<template>
	<view>
		<!-- 使用自定义的搜索组件 -->
		<my-search bgcolor='#c00000' radius="20"></my-search>
		<!-- 分类导航 -->
		<view class="scroll-view-container">
			<!-- 左侧一级分类 -->
			<scroll-view class=".left-scroll-view" scroll-y :style="'height:'+ wh + 'px;'">
				<view @click="activeChanged(i)" class=".left-scroll-view-item" :class="{active:active === i}"
					v-for="(item,i) in cateList" :key="item.cat_id">{{item.cat_name}}
				</view>
			</scroll-view>
			<!-- 右侧：二级三级分类 -->
			<!-- 右侧的滚动视图区域 -->
			<scroll-view class="right-scroll-view" scroll-y :style="{height: wh + 'px'}">
				<view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
					<!-- 二级 -->
					<view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
					<!-- 三级 -->
					<view class="cate-lv3-list">
						<navigator :url="'/subpkg/goods_list/goods_list?cat_id='+item3.cat_id" class="cate-lv3-item"
							v-for="(item3,i3) in item2.children" :key="item3.cat_id">
							<image :src="item3.cat_icon"></image>
							<text>{{item3.cat_name}}</text>
						</navigator>
					</view>
				</view>
			</scroll-view>
		</view>

	</view>
</template>

<script>
	import badgeMixin from '../../mixinx/tabbar-badge.js'
	export default {
		mixins: [badgeMixin],
		data() {
			return {
				cateList: [],
				active: 0,
				wh: 0,
				cateLevel2: []
			};
		},
		onLoad() {
			this.getCataList()
			const windowInfo = uni.getWindowInfo()
			this.wh = windowInfo.windowHeight - 50
		},
		methods: {
			// 选中项改变的事件处理函数
			activeChanged(i) {
				this.active = i
				// 为二级分类列表重新赋值
				this.cateLevel2 = this.cateList[i].children
			},
			// 获取分类
			async getCataList() {
				const {
					data: res
				} = await uni.$http.get('/categories')
				if (res.meta.status !== 200) return uni.$showMsg()
				this.cateList = res.message
				// 为二级分类赋值
				this.cateLevel2 = res.message[this.active].children

			},

		}
	}
</script>

<style lang="scss">
	.scroll-view-container {
		display: flex;

		.left-scroll-view {
			width: 120px;

			.left-scroll-view-item {
				line-height: 60px;
				background-color: #f7f7f7;
				text-align: center;
				font-size: 12px;

				// 激活项的样式
				&.active {
					background-color: #ffffff;
					position: relative;

					// 渲染激活项左侧的红色指示边线
					&::before {
						content: ' ';
						display: block;
						width: 3px;
						height: 30px;
						background-color: #c00000;
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
					}
				}
			}
		}

		.cate-lv2-title {
			font-size: 12px;
			font-weight: bold;
			text-align: center;
			padding: 15px 0;
		}

	}

	.cate-lv3-list {
		display: flex;
		flex-wrap: wrap;

		.cate-lv3-item {
			width: 33.33%;
			margin-bottom: 10px;
			display: flex;
			flex-direction: column;
			align-items: center;

			image {
				width: 60px;
				height: 60px;
			}

			text {
				font-size: 12px;
			}
		}
	}
</style>
