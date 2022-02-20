import zuu from '../../../constants/esper/zuu.json'

export default function handler(req, res) {
  res.status(200).json(zuu)
}
