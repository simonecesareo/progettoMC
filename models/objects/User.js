export default class User {
    constructor(data) {
      this.firstName = data.firstName || '';
      this.lastName = data.lastName || '';
      this.cardFullName = data.cardFullName || '';
      this.cardNumber = data.cardNumber || '';
      this.cardExpireMonth = data.cardExpireMonth || '';
      this.cardExpireYear = data.cardExpireYear || '';
      this.cardCVV = data.cardCVV || '';
      this.uid = data.uid || null;
      this.lastOid = data.lastOid || null;
      this.orderStatus = data.orderStatus || '';
    }
  
    getFullName() {
      return `${this.firstName} ${this.lastName}`.trim();
    }
  }
