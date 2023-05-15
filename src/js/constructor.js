function TodoCard(title, description, user, status) {
  this.title = title
  this.description = description
  this.user = user
  this.time = new Date().toISOString()
  this.id = new Date().getTime()
  this.status = status
}

export { TodoCard }
