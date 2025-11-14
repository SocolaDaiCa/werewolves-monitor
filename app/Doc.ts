class Doc {
  title: string = '';
  description: string = '';
  descriptions: string[] = [];
  deep: number;
  constructor(title: string, description: string, deep: number = 1) {
    this.setTitle(title);
    this.setDescription(description);
    this.setDeep(deep);
  }

  setTitle(title: string) {
    this.title = title;
  }

  setDescription(description: string) {
    this.description = description;
    this.descriptions = this.description.split("\n");
  }

  setDeep(deep: number) {
    this.deep = deep
  }
}

export default Doc;
