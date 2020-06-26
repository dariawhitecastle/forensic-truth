import { Connection } from 'typeorm'

export const entityToJson = (connection: Connection, Entity: any) => {
  const mapType = (x: any) => {
    if (x === Number) return 'integer'
    if (x === String) return 'string'
    throw new Error(`unknown type ${x}`)
  }
  const meta = connection.getMetadata(Entity)
  const properties = meta.columns.map(c => ({
    [c.propertyName]: { type: mapType(c.type) }
  }))
  return {
    $id: 'https://example.com/person.schema.json',
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: meta.name,
    type: 'object',
    properties,
  }
}
