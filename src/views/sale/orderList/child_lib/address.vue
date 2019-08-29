<template>
  <a-row>
    <div
      class="address-list"
      v-for="(item,index) in addressList"
      :key="item.id"
      @click="choseAddress(index,item.id)"
    >
      <div
        class="address-list-item"
        :class="{'item-active':item.id ==addressId}"
        v-if="editInfo && item.id ==addressId && !editDetial"
      >
        <div class="address-list-item-desc">
          {{ocustName}}
          <ul>
            <li>收件人：{{item.receiver}}</li>
            <li>联系方式：{{item.phone}}</li>
            <li>地址：{{item.cityAddress?item.cityAddress:''}}{{item.detailAddr}}</li>
          </ul>
        </div>
      </div>
      <div
        class="address-list-item"
        :class="{'item-active':item.id ==addressId}"
        v-else-if="!editInfo || editDetial"
      >
        <div class="address-list-item-desc">
          {{ocustName}}
          <ul>
            <li>收件人：{{item.receiver}}</li>
            <li>联系方式：{{item.phone}}</li>
            <li>地址：{{item.cityAddress?item.cityAddress:''}}{{item.detailAddr}}</li>
          </ul>
        </div>
      </div>
    </div>
    <span class="editable-add-btn" @click="addAddress" v-show="!editInfo || editDetial">+添加地址</span>
    <a-modal v-model="visible" title="添加地址" :footer="null">
      <addAddress :custId="custId" @addressCancel="addressCancel"></addAddress>
    </a-modal>
  </a-row>
</template>

<script>
import addAddress from '../basic_lib/addAddress'
import api from '@/api/index.js'
import { areas } from 'utils/area.js'
import { get } from '@/api/axios.js'
export default {
  props: {
    ocustName: String,
    custId: String,
    editInfo: {
      type: Boolean,
      required: true,
      default: false
    },
    editDetial: {
      type: Boolean,
      required: true,
      default: false
    },
    addrId: String
  },
  components: {
    addAddress
  },
  data() {
    return {
      addressList: [],
      visible: false,
      areas,
      addressId: this.addrId
    }
  },
  watch: {
    custId(newVal) {
      this.getAddressList(newVal)
    },
    deep: true
  },
  created() {
    this.getAddressList(this.custId)
  },
  methods: {
    // 地址添加
    addAddress() {
      if (this.custId !== '') {
        this.visible = true
      } else {
        this.$message.warning('请先选择客户名称')
      }
    },
    choseAddress(index, id) {
      if (this.editInfo && !this.editDetial) {
        return
      }
      const addressList = this.addressList
      addressList.forEach(item => {
        item.defaultGoodsAddr = 0
      })
      addressList[index].defaultGoodsAddr = 1
      this.addressId = id
      this.$emit('setAddressId', id)
    },
    // 关闭地址新增
    addressCancel(data) {
      if (data) {
        this.getAddressList(this.custId)
      }
      this.visible = false
    },
    // 通过客户Id查询地址列表
    getAddressList(id) {
      get(api.getAddressList + `/${id}`).then(res => {
        const data = res.data.data
        if (data.length > 0) {
          data.forEach(item => {
            if (item.city !== null && item.province !== null && item.area !== null) {
              item['cityAddress'] = this.getCPA(this.areas, [item.province, item.city, item.area], 0, [])
            }
          })
        }
        this.addressList = data
      })
    },
    getCPA(data, code, i, cityAddress) {
      data.forEach(item => {
        if (item.id === code[i]) {
          cityAddress.push(item.name)
          if (item.childrens) {
            this.getCPA(item.childrens, code, i + 1, cityAddress)
          }
        }
      })
      return cityAddress.join('')
    }
  }
}
</script>

<style lang='less' scoped>
.editable-add-btn {
  cursor: pointer;
  margin: 10px;
  display: block;
  line-height: 30px;
  text-align: center;
  border: 1px dashed #ccc;
}
.address-list-item {
  cursor: pointer;
  margin-bottom: 10px;
  &-desc {
    font-size: 14px;
    color: #333333;
    padding: 15px 20px;
    border-radius: 4px;
    background: #fafafa;
    border: 1px solid #d8d8d8;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    ul {
      display: flex;
      margin-bottom: 0;
    }
    li {
      &:not(:last-child)::after {
        content: "/";
        margin: 0 10px;
      }
    }
  }
}
.item-active {
  .address-list-item-desc {
    position: relative;
    background-color: #fdfffa;
    border: 1px solid #69b412;
    &::after {
      content: "";
      border-top-right-radius: 3px;
      border-width: 15px;
      border-style: solid;
      border-color: #69b412 #69b412 transparent transparent;
      position: absolute;
      right: 0px;
      top: 0px;
    }
    &::before {
      content: "";
      position: absolute;
      width: 7px;
      height: 14px;
      border-right: 2px solid #fff;
      border-bottom: 2px solid #fff;
      transform: rotate(40deg);
      top: 0px;
      right: 5px;
      color: #fff;
      font-size: 10px;
      z-index: 999;
      font-size: 16px;
    }
  }
}
</style>
