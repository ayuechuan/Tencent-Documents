import { OpenApi } from "@/utils/axios";


export class GridService extends OpenApi {
  static getDataSource() {
    return this.register('/')
      .getResponseArray(window.location.origin + '/Td' + '/data.json')
  }
}