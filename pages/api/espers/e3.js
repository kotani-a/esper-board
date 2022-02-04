import golem from '../../../constants/golem.json'

export default function handler(req, res) {
  res.status(200).json(golem)
}
