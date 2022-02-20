import golem from '../../../constants/esper/golem.json'

export default function handler(req, res) {
  res.status(200).json(golem)
}
