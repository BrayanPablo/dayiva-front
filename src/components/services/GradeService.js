const API_BASE_URL = 'http://localhost:5000/api';

class GradeService {
  static async getAllGrades() {
    try {
      const response = await fetch(`${API_BASE_URL}/grades`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getAllGrades:', error);
      throw error;
    }
  }

  static async getGradeById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/grades/${id}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getGradeById:', error);
      throw error;
    }
  }

  static async createGrade(gradeData) {
    try {
      const response = await fetch(`${API_BASE_URL}/grades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gradeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en createGrade:', error);
      throw error;
    }
  }

  static async updateGrade(id, gradeData) {
    try {
      const response = await fetch(`${API_BASE_URL}/grades/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gradeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en updateGrade:', error);
      throw error;
    }
  }

  static async deleteGrade(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/grades/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en deleteGrade:', error);
      throw error;
    }
  }
}

export default GradeService;
