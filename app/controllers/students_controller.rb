class StudentsController < ApplicationController
  def index
    if params[:query].present?
      @students = policy_scope(Student).where("first_name LIKE ? OR last_name LIKE ?", "%#{params[:query].capitalize}%","%#{params[:query].capitalize}%")
    else
      @students = policy_scope(Student).order(created_at: :desc)

    end

    authorize @students
  end

  def new
    @student = Student.new
    authorize @student
  end

  def create
    @student = Student.new(student_params)
    @student.user = current_user

    authorize @student

    if @student.save
      redirect_to student_path(@student), notice: "You succesfully added a student."
    else
      render :new
    end
  end

  def show

    @student = Student.find(params[:id])
    authorize @student
    @student_songs = @student.student_songs
    @lessons = @student.lessons.order(date: :desc)

    @upcoming_lessons = @student.lessons.where('date > ?', DateTime.now).order(date: :asc, start_time: :asc)
    @past_lessons = @student.lessons.where('date < ?', DateTime.now).order(date: :desc, start_time: :desc)

    @student_song = StudentSong.new

    @note = Note.new
    authorize @note

    if params[:query].present?

      @songs = policy_scope(Song).where('name LIKE ?', "%#{params[:query].capitalize}%")

    else
      @songs = policy_scope(Song).order(name: :asc)
    end
  end

  def create_student_song
    @selected_song_ids = params[:songs]
    @student = Student.find(params[:id])

    if @selected_song_ids.nil?
      redirect_to student_path(@student), notice: "You haven't selected any songs."
    else
      @selected_song_ids.each do |id|
        @student_song = StudentSong.create(student_id: params[:id], song_id: id)
      end
      redirect_to student_path(@student), notice: "Successfully added to student page."
    end
    authorize @student_song
  end

  private

  def student_params
    params.require(:student).permit(:first_name, :last_name, :skill_level, :user_id, :avatar)
  end
end
