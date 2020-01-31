#ifndef org_apache_lucene_index_IndexWriter$DocStats_H
#define org_apache_lucene_index_IndexWriter$DocStats_H

#include "java/lang/Object.h"

namespace java {
  namespace lang {
    class Class;
  }
}
template<class T> class JArray;

namespace org {
  namespace apache {
    namespace lucene {
      namespace index {

        class IndexWriter$DocStats : public ::java::lang::Object {
         public:

          enum {
            fid_maxDoc,
            fid_numDocs,
            max_fid
          };

          static ::java::lang::Class *class$;
          static jmethodID *mids$;
          static jfieldID *fids$;
          static bool live$;
          static jclass initializeClass(bool);

          explicit IndexWriter$DocStats(jobject obj) : ::java::lang::Object(obj) {
            if (obj != NULL && mids$ == NULL)
              env->getClass(initializeClass);
          }
          IndexWriter$DocStats(const IndexWriter$DocStats& obj) : ::java::lang::Object(obj) {}

          jint _get_maxDoc() const;
          jint _get_numDocs() const;
        };
      }
    }
  }
}

#include <Python.h>

namespace org {
  namespace apache {
    namespace lucene {
      namespace index {
        extern PyType_Def PY_TYPE_DEF(IndexWriter$DocStats);
        extern PyTypeObject *PY_TYPE(IndexWriter$DocStats);

        class t_IndexWriter$DocStats {
        public:
          PyObject_HEAD
          IndexWriter$DocStats object;
          static PyObject *wrap_Object(const IndexWriter$DocStats&);
          static PyObject *wrap_jobject(const jobject&);
          static void install(PyObject *module);
          static void initialize(PyObject *module);
        };
      }
    }
  }
}

#endif
