import malboro from '../../../constants/esper/malboro.json'

export default function handler(req, res) {
  res.status(200).json(malboro)
}
