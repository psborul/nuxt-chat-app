export class Message {
  name: string
  text: string
  id?: string
  time: string

  constructor(name: string, text: string, id?: string) {
    this.name = name
    this.text = text
    this.id = id
    this.time = new Date().toString().slice(15, 24)
  }
}
