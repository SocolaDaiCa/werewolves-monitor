class Doc {
  constructor(title, description, deep = 1) {
    this.setTitle(title);
    this.setDescription(description);
    this.setDeep(deep);
  }

  setTitle(title) {
    this.title = title;
  }

  setDescription(description) {
    this.description = description;
    this.descriptions = this.description.split("\n");
  }

  setDeep(deep) {
    this.deep = deep
  }
}

export default Doc;
