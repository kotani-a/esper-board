import siren from '../../../constants/esper/siren.json'

export default function handler(req, res) {
  res.status(200).json(siren)
}
