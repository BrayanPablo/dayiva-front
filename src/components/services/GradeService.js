import { apiGet, apiPost, apiPut, apiDelete } from '../../utils/api';

const API_URL = '/api/grades';

class GradeService {
  static async getAllGrades() {
    try {
      const res = await apiGet(API_URL);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error('Error en getAllGrades:', error);
      throw error;
    }
  }

  static async getGradeById(id) {
    try {
      const res = await apiGet(`${API_URL}/${id}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error('Error en getGradeById:', error);
      throw error;
    }
  }

  static async createGrade(gradeData) {
    try {
      const res = await apiPost(API_URL, gradeData);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Error ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      console.error('Error en createGrade:', error);
      throw error;
    }
  }

  static async updateGrade(id, gradeData) {
    try {
      const res = await apiPut(`${API_URL}/${id}`, gradeData);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Error ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      console.error('Error en updateGrade:', error);
      throw error;
    }
  }

  static async deleteGrade(id) {
    try {
      const res = await apiDelete(`${API_URL}/${id}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Error ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      console.error('Error en deleteGrade:', error);
      throw error;
    }
  }
}

export default GradeService;
