<template>
  <!-- 这里专门做添加与修改spu组件 -->
  <div>
    <!-- SPU名称~SPU图片 -->
    <el-form label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spuInfo.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spuInfo.tmId" placeholder="请选择品牌">
          <el-option
            v-for="trademark in trademarkList"
            :key="trademark.id"
            :label="trademark.tmName"
            :value="trademark.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          v-model="spuInfo.description"
          type="textarea"
          placeholder="描述"
          :rows="4"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="showImgsList"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-remove="handleRemove"
          :on-preview="handlePictureCardPreview"
        >
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过2MB
          </div>
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img :src="dialogImageUrl" width="100%" />
        </el-dialog>
      </el-form-item>
    </el-form>
    <!-- 销售属性 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="销售属性">
        <el-select
          v-model="saleAttrIdAndValue"
          :placeholder="`还有${withoutChooseAttrList.length}未选择`"
        >
          <el-option
            v-for="baseSaleAttr in withoutChooseAttrList"
            :key="baseSaleAttr.id"
            :label="baseSaleAttr.name"
            :value="`${baseSaleAttr.id}:${baseSaleAttr.name}`"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="!saleAttrIdAndValue"
          type="primary"
          icon="el-icon-plus"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 销售属性的表格 -->
    <el-table
      :data="spuInfo.spuSaleAttrList"
      style="width: 100%; margin-bottom: 20px"
      border
    >
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="saleAttrName" label="属性名" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="属性名称列表" width="width">
        <template slot-scope="{ row, $index }">
          <el-tag
            @close="handleClose(row, saleAttrValue)"
            v-for="saleAttrValue in row.spuSaleAttrValueList"
            :key="saleAttrValue.saleAttrValueName"
            closable
            :disable-transitions="false"
            style="margin: 0px 10px"
            size="small"
          >
            {{ saleAttrValue.saleAttrValueName }}
          </el-tag>
          <!--  
            v-model="inputValue" 
            @keyup.enter.native="handleInputConfirm"
            -->
          <el-input
            @blur="handleInputConfirm(row)"
            v-if="row.inputVisible"
            v-model="row.newSaleAttrValueName"
            class="input-new-tag"
            :ref="row.baseSaleAttrId"
            size="small"
            style="width: 80px"
          >
          </el-input>
          <el-button
            @click="showInput(row)"
            v-else
            class="button-new-tag"
            size="small"
            >+添加</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-popconfirm
            :title="`确定要删除${row.saleAttrName}吗？`"
            @onConfirm="deleteAttr(row)"
          >
            <Hintbutton
              type="danger"
              icon="el-icon-delete"
              size="mini"
              slot="reference"
            ></Hintbutton>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="addOrUpdateSpuInfo">保存</el-button>
    <el-button @click="$emit('changeScene', 0)">取消</el-button>
  </div>
</template>

<script>
import { mapState } from "vuex";
import _ from "lodash";
export default {
  data() {
    return {
      //#region
      //       {
      //   "category3Id": 0,
      //   "description": "",
      //   "tmId": 0
      //   "spuName": "",
      //   "id": 0, //添加不需要，修改需要
      //   "spuImageList": [
      //     {
      //       "imgName": "string",
      //       "imgUrl": "string",
      //       "spuId": 0  //添加不需要，修改需要
      //     }
      //   ],
      //   "spuSaleAttrList": [
      //     {
      //       "baseSaleAttrId": 0,
      //       "saleAttrName": "",
      //       "spuId": 0, //添加不需要，修改需要
      //       "spuSaleAttrValueList": [
      //         {
      //           "baseSaleAttrId": 0,
      //           "saleAttrName": "",
      //           "saleAttrValueName": "",
      //           "spuId": 0  //添加不需要，修改需要
      //         }
      //       ]
      //     }
      //   ],
      // }
      //#endregion
      // 保存或者修改Spu发给服务器的请求体
      spuInfo: {
        category3Id: "",
        description: "",
        tmId: "",
        spuName: "",
        spuImageList: [],
        spuSaleAttrList: [],
      },
      // 控制弹框显示的变量
      dialogVisible: false,
      // 控制图片放大图片的图片地址
      dialogImageUrl: "",
      // 保存选中的销售属性id和value
      saleAttrIdAndValue: "",
      // 用来展示图片墙的数组
      showImgsList: []
    };
  },
  props:['category3Id'],
  computed: {
    ...mapState("spu", [
      "trademarkList",
      "baseSaleAttrList",
      "currentSpuInfo",
      "spuImgList",
    ]),
    // 未选择的属性列表
    withoutChooseAttrList() {
      let saleAttrIdArr = this.spuInfo.spuSaleAttrList.map(
        (item) => item.baseSaleAttrId
      );
      return this.baseSaleAttrList.filter(
        (item) => saleAttrIdArr.indexOf(item.id) == -1
      );
    },
  },
  mounted() {},
  methods: {
    // 移除图片时的回调
    handleRemove(file, fileList) {
      this.showImgsList = fileList;
    },
    // 放大图片时的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.imgUrl;
      this.dialogVisible = true;
    },
    // 上传成功时的回调
    handleAvatarSuccess(res, file) {
      if (res.code == 200) {
        //  上传成功,整理属性保存在spuInfo中
        this.showImgsList.push({
          imgName: file.name,
          imgUrl: res.data,
          // 因为加了照片墙属性 :file-list="spuInfo.spuImageList" 所以需要name和url才能显示
          name: file.name,
          url: res.data,
        });
      } else {
        this.$message.error("图片上传失败");
      }
    },
    // 上传前的回调
    beforeAvatarUpload(file) {
      const isJPGorPNG =
        file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPGorPNG) {
        this.$message.error("上传头像图片只能是 JPG或者PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPGorPNG && isLt2M;
    },
    // 添加销售属性
    addSaleAttr() {
      // 添加销售属性
      let { saleAttrIdAndValue } = this;
      this.spuInfo.spuSaleAttrList.push({
        baseSaleAttrId: parseInt(saleAttrIdAndValue.split(":")[0]),
        saleAttrName: saleAttrIdAndValue.split(":")[1],
        spuSaleAttrValueList: [],
      });
      // 将saleAttrIdAndValue置空
      this.saleAttrIdAndValue = "";
    },
    // 点击添加按钮时的回调
    showInput(row) {
      // 显示input框
      this.$set(row, "inputVisible", true);
      // 自动聚焦
      this.$nextTick(() => {
        this.$refs[row.baseSaleAttrId].focus();
      });
    },
    // input在blur时的回调 (此时attrList里面多了newSaleAttrValueName和inputVisible字段，后面保存时去掉)
    handleInputConfirm(row) {
      if (row.newSaleAttrValueName && row.newSaleAttrValueName.trim()) {
        //如果存在该字段
        let nameArr = row.spuSaleAttrValueList.map(
          (item) => item.saleAttrValueName
        );
        if (
          row.spuSaleAttrValueList.length &&
          nameArr.indexOf(row.newSaleAttrValueName) != -1
        ) {
          //销售属性值列表存在值且有重复值
          this.$message({ message: "值不能重复", type: "warning" });
        } else {
          //销售属性值列表不存在值或者没有有重复值
          row.spuSaleAttrValueList.push({
            baseSaleAttrId: row.baseSaleAttrId,
            saleAttrName: row.saleAttrName,
            saleAttrValueName: row.newSaleAttrValueName,
          });
          // 将数值置空,并且将input框的可见性关闭
          row.newSaleAttrValueName = "";
          row.inputVisible = false;
        }
      } else {
        //不存在该字段或者值为空
        this.$message({ message: "值不能为空", type: "warning" });
        row.inputVisible = false;
      }
    },
    // 删除属性
    deleteAttr(row) {
      // 移除对应的属性
      this.spuInfo.spuSaleAttrList.forEach((item, index) => {
        if (item.baseSaleAttrId == row.baseSaleAttrId) {
          this.spuInfo.spuSaleAttrList.splice(index, 1);
          this.$message({ message: "删除成功", type: "success" });
        }
      });
    },
    // 点击删除属性值时的回调
    handleClose(row, saleAttrValue) {
      // 移除对应的属性值
      row.spuSaleAttrValueList.forEach((item, index) => {
        // 属性值是唯一的
        if (item.saleAttrValueName == saleAttrValue.saleAttrValueName) {
          row.spuSaleAttrValueList.splice(index, 1);
        }
      });
    },
    // 新增或者修改spu 待修改
    async addOrUpdateSpuInfo(){
      // 1.整理category3Id
      if(!this.spuInfo.category3Id){
         this.spuInfo.category3Id = this.category3Id
      }
      // 2.整理showImgsList到spuInfo.spuImageList中
      this.spuInfo.spuImageList = _.cloneDeep(this.showImgsList)
      this.spuInfo.spuImageList.forEach(item=>{
         delete item.status
         delete item.uid
         delete item.name
         delete item.url
         if(this.spuInfo.id){
           item.spuId = this.spuInfo.id
         }
      })
      // 3. 整理spuSaleAttrList
      this.spuInfo.spuSaleAttrList.forEach(item=>{
        delete item.inputVisible
        delete item.newSaleAttrValueName
        if(this.spuInfo.id) item.spuId = this.spuInfo.id
        if(item.spuSaleAttrValueList.length){
          item.spuSaleAttrValueList.forEach(item=>{
            delete item.isChecked
            if(this.spuInfo.id) item.spuId = this.spuInfo.id
          })
        }
      })
      // 4.发请求进行更新或者保存
    let result = await this.$API.product.spu.addOrUpdateSpuInfo(this.spuInfo) 
    if(result.code == 200){
      this.$emit('changeScene', 0) // 跳回列表页
      this.$message({message:this.spuInfo.id?'修改成功':'新增成功',type:'success'}) //弹框
    }else{
      this.$message.error(this.spuInfo.id?'修改失败':'新增失败')
    }
     
    }

  },
  watch: {
    currentSpuInfo: {
      handler(newValue, oldValue) {
        newValue.spuImageList =
          newValue.spuImageList == null ? [] : newValue.spuImageList;
        this.spuInfo = _.cloneDeep(newValue);
      },
    },
    spuImgList: {
      handler(newValue, oldValue) {
        // this.spuInfo.spuImageList = _.cloneDeep(newValue);
        if (newValue) {
          let temArrr = newValue.map((item) => {
            return {
              id: item.id,
              imgName: item.imgName,
              imgUrl: item.imgUrl,
              spuId: item.spuId,
              name: item.imgName,
              url: item.imgUrl,
            };
          });
          this.showImgsList = _.cloneDeep(temArrr) || [];
          // console.log(showImgsList);
        }
      },
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>