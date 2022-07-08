<template>
  <!-- 这里专门做添加sku的组件 -->
  <div>
    <el-form
      label-width="100px"
      :rules="rules"
      :model="skuInfo"
      status-icon
      ref="addSkuForm"
      class="demo-ruleForm"
    >
      <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
      <el-form-item label="SKU名称" prop="skuName">
        <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)" prop="price">
        <!-- @change="handleChange"   -->
        <el-input
          type="number"
          v-model="skuInfo.price"
          placeholder="价格(元)"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)" prop="weight">
        <el-input
          placeholder="重量(千克)"
          type="number"
          v-model="skuInfo.weight"
        ></el-input>
      </el-form-item>
      <el-form-item label="规格描述" prop="skuDesc">
        <el-input
          v-model="skuInfo.skuDesc"
          type="textarea"
          placeholder="描述"
          :rows="4"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性" prop="skuAttrValueList">
        <el-col :span="6" v-for="attr in attrList" :key="attr.id">
          <el-form-item :label="attr.attrName">
            <!-- 将点击选中的平台属性值id和平台属性拼接后的值保存在每个平台属性的valueId属性内 -->
            <el-select
              @clear="clearAttr(attr)"
              @change="attrChange(attr)"
              clearable
              v-model="attr.attrValueIdAndName"
              placeholder="请选择"
            >
              <el-option
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
                :label="attrValue.valueName"
                :value="`${attrValue.id}:${attrValue.valueName}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="销售属性" prop="skuSaleAttrValueList">
        <el-col
          :span="6"
          v-for="spuSaleAttr in spuSaleAttrList"
          :key="spuSaleAttr.id"
        >
          <el-form-item :label="spuSaleAttr.saleAttrName">
            <!-- v-model='xxxx' -->
            <el-select
              v-model="spuSaleAttr.saleAttrValueIdAndName"
              placeholder="请选择"
              clearable
              @clear="clearSaleAttr(spuSaleAttr)"
              @change="saleAttrChange(spuSaleAttr)"
            >
              <el-option
                v-for="spuSaleAttrValue in spuSaleAttr.spuSaleAttrValueList"
                :key="spuSaleAttrValue.id"
                :label="spuSaleAttrValue.saleAttrValueName"
                :value="`${spuSaleAttrValue.id}:${spuSaleAttrValue.saleAttrValueName}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="图片列表" prop="skuImageList">
        <el-table
          @selection-change="handleSelectionChange"
          :data="spuImgListForShow"
          style="width: 100%"
          border
        >
          <el-table-column type="selection" width="100px"> </el-table-column>
          <el-table-column prop="prop" label="图片">
            <template slot-scope="{ row, $index }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"> </el-table-column>
          <el-table-column prop="prop" label="操纵">
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                size="mini"
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
                >设置默认</el-button
              >
              <el-tag :disable-transitions="true" v-else>默认</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="saveSku">保存</el-button>
    <el-button @click="$emit('changeScene', 0)">取消</el-button>
  </div>
</template>

<script>
import { mapState } from "vuex";
import _ from "lodash";
export default {
  data() {
    // 自定义价格验证规则
    var validatePrice = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入价格"));
      } else {
        if (value < 0) {
          callback(new Error("请输入合理价格"));
        }
        callback();
      }
    };
    var validateWeight = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入重量"));
      } else {
        if (value < 0) {
          callback(new Error("请输入合理重量"));
        }
        callback();
      }
    };
    var validateAttr = (rule, value, callback) => {
      if (value.length < 2) {
        callback(new Error("至少选择两项"));
      } else {
        callback();
      }
    };
    var validateSaleAttr = (rule, value, callback) => {
      if (value.length < this.spuSaleAttrList.length) {
        callback(new Error("销售属性都需要选择"));
      } else {
        callback();
      }
    };
    var validateImg = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error("至少需要一张图片"));
      } else {
        callback();
      }
    };
    return {
      // #region
      //       {
      //   "category3Id": 0,
      //   "price": 0,
      //   "spuId": 0,
      //   "tmId": 0,
      //   "weight": ""
      //   "skuDefaultImg": "",
      //   "skuDesc": "",
      //   "skuName": "",
      //   "skuAttrValueList": [
      //     {
      //       "attrId": 0,
      //       "attrName": "",
      //       "valueId": 0,
      //       "valueName": ""
      //     }
      //   ],
      //   "skuImageList": [
      //     {
      //       "imgName": "",
      //       "imgUrl": "",
      //       "isDefault": "", 0是非默认  1是默认
      //       "spuImgId": 0 这个就是spuId
      //     }
      //   ],
      //   "skuSaleAttrValueList": [
      //     {
      //       "saleAttrId": 0,
      //       "saleAttrName": "",
      //       "saleAttrValueId": 0,
      //       "saleAttrValueName": "",
      //       "spuId": 0
      //     }
      //   ],
      // }
      // #region
      // 新增sku的请求体对象
      skuInfo: {
        category3Id: "",
        price: "",
        spuId: "",
        tmId: "",
        weight: "",
        skuDefaultImg: "",
        skuDesc: "",
        skuName: "",
        skuAttrValueList: [],
        skuImageList: [],
        skuSaleAttrValueList: [],
      },
      // 校验规则
      rules: {
        skuName: [
          { required: true, message: "请输入SKU名称", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "长度在 2 到 15 个字符",
            trigger: "blur",
          },
        ],
        price: [{ required: true, validator: validatePrice, trigger: "blur" }],
        weight: [
          { required: true, validator: validateWeight, trigger: "blur" },
        ],
        skuDesc: [
          { required: true, message: "请输入SKU描述", trigger: "blur" },
          {
            min: 10,
            max: 300,
            message: "长度在 10 到 300 个字符",
            trigger: "blur",
          },
        ],
        skuAttrValueList: [
          { required: true, validator: validateAttr, trigger: "change" },
        ],
        skuSaleAttrValueList: [
          { required: true,  validator: validateSaleAttr, trigger: "change" },
        ],
        skuImageList: [{ required: true, validator: validateImg, trigger: "change" }],
      },
    };
  },
  props: ["spu", "category3Id"],
  mounted() {},
  computed: {
    ...mapState("spu", ["spuImgList", "attrList", "spuSaleAttrList"]),
    // 给spuImgList里面的每个元素加上isDefault字段
    spuImgListForShow() {
      return this.spuImgList.map((item) => {
        return { ...item, isDefault: 0 };
      });
    },
  },
  methods: {
    // 切换默认选中
    changeDefault(row) {
      if (this.skuInfo.skuImageList) {
        let arr = this.skuInfo.skuImageList.map((item) => item.id);
        if (arr.indexOf(row.id) != -1) {
          //  排他
          this.spuImgListForShow.forEach((item) => (item.isDefault = 0));
          row.isDefault = 1;
          // 在skuInfo.skuImageList中也要赋值默认选中图片的isDefault为1
          this.skuInfo.skuImageList.forEach((item) => {
            item.isDefault = 0;
            if (item.id == row.id) item.isDefault = 1;
          });
        } else {
          this.$message.error("请选择已勾选的图片");
        }
      } else {
        this.$message.error("请选择已勾选的图片");
      }
    },
    // 勾选状态发生改变时的回调
    handleSelectionChange(rows) {
      // 把勾选到的图片对象深拷贝到请求体对象中的图片列表中,此时的spuId还是spuImgId
      this.skuInfo.skuImageList = _.cloneDeep(rows);
      // 每次改变都验证
        this.$refs["addSkuForm"].validateField("skuImageList");
    },
    // 选中attrValue后,都整理属性，并且push到skuInfo的skuAttrValueList
    attrChange(attr) {
      // 注意：清空也会进来
      if (attr.attrValueIdAndName) {
        this.skuInfo.skuAttrValueList.push({
          attrName: attr.attrName,
          attrId: attr.id,
          valueId: parseInt(attr.attrValueIdAndName.split(":")[0]),
          valueName: attr.attrValueIdAndName.split(":")[1],
        });
        // 每次改变都验证
        this.$refs["addSkuForm"].validateField("skuAttrValueList");
      }
    },
    // 每次清除attrValue,也需要移除skuInfo的skuAttrValueLis中的相同元素
    clearAttr(attr) {
      this.skuInfo.skuAttrValueList.forEach((item, index) => {
        if (item.attrId == attr.id)
          this.skuInfo.skuAttrValueList.splice(index, 1);
      });
      delete attr.attrValueIdAndName;
      // 每次改变都验证
      this.$refs["addSkuForm"].validateField("skuAttrValueList");
    },
    // 选中saleAttrValue后,整理属性，并且push到skuInfo的skuAttrValueList中
    saleAttrChange(spuSaleAttr) {
      if (spuSaleAttr.saleAttrValueIdAndName) {
        this.skuInfo.skuSaleAttrValueList.push({
          saleAttrId: spuSaleAttr.baseSaleAttrId,
          saleAttrName: spuSaleAttr.saleAttrName,
          saleAttrValueId: parseInt(
            spuSaleAttr.saleAttrValueIdAndName.split(":")[0]
          ),
          saleAttrValueName: spuSaleAttr.saleAttrValueIdAndName.split(":")[1],
          spuId: spuSaleAttr.spuId,
        });
        // 每次改变都验证
        this.$refs["addSkuForm"].validateField("skuSaleAttrValueList");
      }
    },
    // 每次清除saleAttrValue,也需要移除skuInfo的skuSaleAttrValueList中的相同元素
     clearSaleAttr(spuSaleAttr){
       this.skuInfo.skuSaleAttrValueList.forEach((item,index)=>{
          if(item.saleAttrId == spuSaleAttr.baseSaleAttrId)
          this.skuInfo.skuSaleAttrValueList.splice(index,1)
       })
       delete spuSaleAttr.saleAttrValueIdAndName
       // 每次改变都验证
        this.$refs["addSkuForm"].validateField("skuSaleAttrValueList");
     },

    // 点击保存sku按钮，执行回调
    saveSku() {
      // 1.整理skuImageList里面的spuId字段改为spuImgId,以及添加默认照片skuDefaultImg
      if (this.skuInfo.skuImageList.length) {
        this.skuInfo.skuImageList.forEach((item) => {
          // 添加默认图片
          if (item.isDefault) this.skuInfo.skuDefaultImg = item.imgUrl;
          item.spuImgId = item.spuId ? item.spuId : item.spuImgId;
          delete item.spuId;
          delete item.id;
        });
        // 如果勾选了图片还没有设置默认图片就保存，默认为第一张图片是默认图片
        if (!this.skuInfo.skuDefaultImg) {
          this.skuInfo.skuDefaultImg = this.skuInfo.skuImageList[0].imgUrl;
          this.skuInfo.skuImageList[0].isDefault = 1;
        }
      }
      // 2. 添加剩下的category3Id、tmId、spuId
      this.skuInfo.category3Id = this.category3Id;
      this.skuInfo.tmId = this.spu.tmId;
      this.skuInfo.spuId = this.spu.id;

      // 3.整体的表单验证
      this.$refs["addSkuForm"].validate(async (valid) => {
        if (valid) {
          //验证成功
          // 发请求保存新增的sku
          let result = await this.$API.product.spu.saveSkuInfo(this.skuInfo);
          if (result.code == 200) {
            // 弹框提示
            this.$message({ message: "提交成功", type: "success" });
            // 重置skuInfo
            Object.assign(this._data.skuInfo, this.$options.data().skuInfo);
            // 跳转回列表页
            this.$emit("changeScene", 0);
            return "ok";
          }
        } else {
          // 验证失败
          this.$message.error("提交失败");
          return Promise.reject(new Error("faile"));
        }
      });
    },
  },
};
</script>

<style>
</style>