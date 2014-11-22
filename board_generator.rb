=begin
Generates an HTML board for the Chess Commentator.

@author Jiangcheng Oliver Chu

Internal implementation:

1
2
3
4
5
6
7
8
 a b c d e f g h
 
Note that real algebraic chess notation differs from our internal implementation.
Here is algebraic chess notation:

8
7
6
5
4
3
2
1
 a b c d e f g h
=end

def wrap_entity(char)
  return "&#x265#{char};"
end

def get_html_ref_entity(chess_piece, color)
  case color
    when :white
      case chess_piece
        when :king
          return wrap_entity('4')
        when :queen
          return wrap_entity('5')
        when :rook
          return wrap_entity('6')
        when :bishop
          return wrap_entity('7')
        when :knight
          return wrap_entity('8')
        when :pawn
          return wrap_entity('9')
      end
    when :black
      case chess_piece
        when :king
          return wrap_entity('a')
        when :queen
          return wrap_entity('b')
        when :rook
          return wrap_entity('c')
        when :bishop
          return wrap_entity('d')
        when :knight
          return wrap_entity('e')
        when :pawn
          return wrap_entity('f')
      end
  end
  puts "Bad piece selection: #{color} #{chess_piece}"
  return nil
end

def create_html_of_piece(entity_ref)
  return "<span class=\"piece\">#{entity_ref}</span>\n"
end

def generate_board
  board = ''
  board_width = 8
  board_height = 8
  use_white_tile = true
  columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  rows = ['1', '2', '3', '4', '5', '6', '7', '8']
  i = 0
  home_row = [:rook, :knight, :bishop, :queen, :king, :bishop, :knight, :rook]
  board_height.times do
    board += "<tr>\n"
    j = 0
    board_width.times do
      squareString = columns[j].to_s + rows[i].to_s
      board += "<td id=\"#{squareString}\" " +
               "onclick=\"toggleSquare('#{squareString}');\" " +
               "class=\"#{use_white_tile ? 'white_tile' : 'blue_tile'}\">\n"
      case i
        when 0
          # Black home row
          piece = home_row[j]
          board += create_html_of_piece(get_html_ref_entity(piece, :black))
        when 1
          # Black pawn row
          board += create_html_of_piece(get_html_ref_entity(:pawn, :black))
        when 6
          # White pawn row
          board += create_html_of_piece(get_html_ref_entity(:pawn, :white))
        when 7
          # White home row
          piece = home_row[j]
          board += create_html_of_piece(get_html_ref_entity(piece, :white))
      end
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
  template = File.new('chess_commentator_template.html', 'r')
  template_string = template.read()
  final_string = template_string.gsub(/<!--@@CHESSBOARD-->/, generate_board)
  f = File.new('chess_commentator.html', 'w')
  f.write(final_string)
  f.close
  puts 'Done!'
end

main