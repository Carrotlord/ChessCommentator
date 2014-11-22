=begin
Generates an HTML board for the Chess Commentator.

@author Jiangcheng Oliver Chu
=end

def generate_board
  board = ''
  board_width = 8
  board_height = 8
  use_white_tile = true
  columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  rows = ['1', '2', '3', '4', '5', '6', '7', '8']
  i = 0
  board_height.times do
    board += "<tr>\n"
    j = 0
    board_width.times do
      board += "<td id=\"#{columns[i].to_s + rows[j].to_s}\" class=\"#{use_white_tile ? 'white_tile' : 'blue_tile'}\">\n"
      board += "</td>\n"
      use_white_tile = !use_white_tile
      j += 1
    end
    board += "</tr>\n"
    # Flip the tile when switching rows
    use_white_tile = !use_white_tile
    i += 1
  end
  return board
end

def main
  f = File.new('board.txt', 'w')
  f.write(generate_board)
  f.close
  puts 'Done!'
end

main