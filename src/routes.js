import { Database } from './database.js'
import { registerDate } from '../util/register-date.js'
import { buildRoutePath } from '../util/build-route-path.js'
import { randomUUID } from 'node:crypto'

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select('tasks', search ? {
                title: search
            } : null)

            return res
                .setHeader('Content-type', 'application/json')
                .end(JSON.stringify(tasks))
                }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body
            const task = {
                id: randomUUID(),
                title,
                description,
                created_at: registerDate(),
                updated_at: null,
                completed_at: null,
                completed: false
            }
            database.insert('tasks', task)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            database.update('tasks', id, {
                title,
                description,
                updated_at: registerDate()
            })

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            database.update('tasks', id, {
                completed_at: registerDate(),
                completed: true
            })

            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            database.delete('tasks', id)

            return res.writeHead(204).end()
        }
    }
]

