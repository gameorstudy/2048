// import arrow_up from "./assets/arrow-up.png";
const count = 4 * 4;

const app = Vue.createApp({
  data() {
    return {
      hint: "点击方向键以移动所有方块儿",
      message: "",
      imgList: [
        {
          imageUrl: "./assets/arrow-up.png",
          id: 1,
          styleData: {},
          classData: "up",
        },

        {
          imageUrl: "./assets/arrow-up.png",
          id: 2,
          styleData: {
            transform: "rotate(-90deg)",
          },
          classData: "left",
        },
        {
          imageUrl: "./assets/arrow-up.png",
          id: 3,
          styleData: {
            transform: "rotate(180deg)",
          },
          classData: "down",
        },
        {
          imageUrl: "./assets/arrow-up.png",
          id: 4,
          styleData: {
            transform: "rotate(90deg)",
          },
          classData: "right",
        },
      ],
      dataList: Array.apply(null, Array(count)),
    };
  },
  mounted() {
    this.geneANum();
    // this.dataList.splice(0, 1, "2");
    // this.dataList.splice(2, 1, "2");
    // this.dataList.splice(3, 1, "2");
  },
  methods: {
    computeHSLColor(i) {
      // 2048 一共需要12种渐变色
      const hGap = 18; // min: 30 max: 345
      const sValue = 80;
      const lGap = 16;
      let hslColors = [];

      for (let h = 30; h <= 345; h += hGap) {
        hslColors.push(
          `hsl(${h}, ${sValue}%, ${sValue - (((h - 30) / hGap) % 3) * lGap}%)`
        );
      }

      return hslColors[i];
    },
    geneANum() {
      // 产生一个随机位置的数
      // 遍历查看没有占位的下标
      let getIndexOfEmpty = [];
      this.dataList.map((item, index) => {
        if (!!item === false) {
          getIndexOfEmpty.push(index);
        }
      });

      // 产生一个随机数并放置
      if (getIndexOfEmpty.length === 0) {
        this.message = "游戏结束";
        return;
      }

      const index = Math.floor(Math.random() * getIndexOfEmpty.length);
      this.dataList.splice(getIndexOfEmpty[index], 1, "2");
    },
    handleClick(pos) {
      if (pos === "down") {
        this.handleDownClick();
      } else if (pos === "up") {
        this.handleUpClick();
      } else if (pos === "left") {
        this.handleLeftClick();
      } else {
        this.handleRightClick();
      }
    },
    getColsList() {
      // 获取每一纵列的下标
      const countPerRow = Math.pow(count, 0.5);
      let colsList = [];
      for (let i = 0; i < countPerRow; i++) {
        colsList[i] = [];
        for (let j = 0; j < countPerRow; j++) {
          colsList[i].push(i + countPerRow * j);
        }
      }

      return colsList;
    },
    getRowsList() {
      // 获取每一横行的下标
      const countPerRow = Math.pow(count, 0.5);
      let rowsList = [];
      for (let i = 0; i < countPerRow; i++) {
        rowsList[i] = [];
        for (let j = 0; j < countPerRow; j++) {
          rowsList[i].push(i * countPerRow + j);
        }
      }

      return rowsList;
    },
    computePos(dataList) {
      // from top to bottom

      dataList.map((eachItem) => {
        for (let i = eachItem.length - 1; i > 0; i--) {
          for (let j = i - 1; j >= 0; j--) {
            if (
              !!this.dataList[eachItem[i]] &&
              this.dataList[eachItem[i]] === this.dataList[eachItem[j]]
            ) {
              this.dataList.splice(
                eachItem[i],
                1,
                String(this.dataList[eachItem[i]] * 2)
              );
              this.dataList.splice(eachItem[j], 1, undefined);

              i = j;
            } else if (
              !!this.dataList[eachItem[i]] &&
              !!this.dataList[eachItem[j]] &&
              this.dataList[eachItem[i]] !== this.dataList[eachItem[j]]
            ) {
              break;
            }
          }
        }
      });
    },
    computeOppositePos(dataList) {
      // from bottom to top

      dataList.map((eachItem) => {
        for (let i = 0; i < eachItem.length - 1; i++) {
          for (let j = i + 1; j <= eachItem.length - 1; j++) {
            if (
              !!this.dataList[eachItem[i]] &&
              this.dataList[eachItem[i]] === this.dataList[eachItem[j]]
            ) {
              this.dataList.splice(
                eachItem[i],
                1,
                String(this.dataList[eachItem[i]] * 2)
              );
              this.dataList.splice(eachItem[j], 1, undefined);

              i = j;
            } else if (
              !!this.dataList[eachItem[i]] &&
              !!this.dataList[eachItem[j]] &&
              this.dataList[eachItem[i]] !== this.dataList[eachItem[j]]
            ) {
              break;
            }
          }
        }
      });
    },
    handleDown(colsList) {
      const countPerRow = Math.pow(count, 0.5);

      colsList.map((eachCol) => {
        eachCol = eachCol.reverse(); // 减少判断次数

        let temp = -1;

        eachCol.map((index) => {
          const col = index % countPerRow; // 获取当前列的下标

          let i = temp > -1 ? temp : countPerRow - 1;
          while (i >= 0) {
            const j = countPerRow * i + col;
            if (
              index < j &&
              !!this.dataList[index] &&
              !!this.dataList[j] === false
            ) {
              this.dataList.splice(j, 1, this.dataList[index]);
              this.dataList.splice(index, 1, undefined);

              temp = i - 1; // 保存当前下标

              i = -1;
            }

            i--;
          }
        });
      });
    },
    handleUp(colsList) {
      const countPerRow = Math.pow(count, 0.5);

      colsList.map((eachCol) => {
        let temp = -1;

        eachCol.map((index) => {
          const col = index % countPerRow; // 获取当前列的下标

          let i = temp > -1 ? temp : 0;
          while (i <= countPerRow - 1) {
            const j = countPerRow * i + col;
            if (
              index > j &&
              !!this.dataList[index] &&
              !!this.dataList[j] === false
            ) {
              this.dataList.splice(j, 1, this.dataList[index]);
              this.dataList.splice(index, 1, undefined);

              temp = i - 1; // 保存当前下标

              i = countPerRow + 1;
            }

            i++;
          }
        });
      });
    },
    handleLeft(rowsList) {
      const countPerRow = Math.pow(count, 0.5);

      rowsList.map((eachRow, rowIndex) => {
        let temp = -1;

        eachRow.map((index) => {
          let i = temp > -1 ? temp : 0;
          while (i <= countPerRow - 1) {
            let j = rowIndex * countPerRow + i;
            if (
              index > j &&
              !!this.dataList[index] &&
              !!this.dataList[j] === false
            ) {
              this.dataList.splice(j, 1, this.dataList[index]);
              this.dataList.splice(index, 1, undefined);

              temp = i - 1; // 保存当前下标

              i = countPerRow;
            }

            i++;
          }
        });
      });
    },
    handleRight(rowsList) {
      const countPerRow = Math.pow(count, 0.5);

      rowsList.map((eachRow, rowIndex) => {
        eachRow.reverse(); // 减少判断次数

        let temp = -1;

        eachRow.map((index) => {
          let i = temp > -1 ? temp : countPerRow - 1;
          while (i >= 0) {
            let j = rowIndex * countPerRow + i;
            if (
              index < j &&
              !!this.dataList[index] &&
              !!this.dataList[j] === false
            ) {
              this.dataList.splice(j, 1, this.dataList[index]);
              this.dataList.splice(index, 1, undefined);

              temp = i - 1; // 保存当前下标

              i = -1;
            }

            i--;
          }
        });
      });
    },
    handleDownClick() {
      // 点击 down 按钮

      const colsList = this.getColsList();

      // 计算每一次值改变
      this.computePos(colsList);

      // 位置掉落
      this.handleDown(colsList);

      // 游戏继续
      this.geneANum();
    },
    handleUpClick() {
      // 点击up按钮

      const colsList = this.getColsList();

      // 计算每一次值改变
      this.computeOppositePos(colsList);

      // 位置上升
      this.handleUp(colsList);

      // 游戏继续
      this.geneANum();
    },
    handleLeftClick() {
      // 点击 left 按钮

      const rowsList = this.getRowsList();

      // 计算每一次值改变
      this.computeOppositePos(rowsList);

      // 位置左移
      this.handleLeft(rowsList);

      // 游戏继续
      this.geneANum();
    },
    handleRightClick() {
      // 点击 right 按钮

      const rowsList = this.getRowsList();

      // 计算每一次值改变
      this.computePos(rowsList);

      // 位置右移
      this.handleRight(rowsList);

      // 游戏继续
      this.geneANum();
    },
  },
});
