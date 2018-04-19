import Utils from "../Utils";

export default class Variable {
  static get CTypes() {
    return { ARRAY: "C_ARRAY", DATA: "C_DATA" };
  }

  constructor(data) {
    const [ cType, address ] = data;
    this.cType = cType;
    this.address = address;
    if (cType === Variable.CTypes.ARRAY) {
      this.type = "array";
      this.value = Utils.arrayOfType(Variable, data.slice(2));
    } else {
      this.type = data[2];
      this.value = data[3];
    }
  }

  isUninitialized() {
    return this.value === "<UNINITIALIZED>";
  }

  isNull() {
    return (this.type === "pointer" || this.type === "array") && this.value === "0x0";
  }
}